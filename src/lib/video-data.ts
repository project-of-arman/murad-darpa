
'use server';

import pool, { queryWithRetry } from './db';
import { revalidatePath } from 'next/cache';
import { toDataURL } from './utils';

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  dataAiHint: string;
}

export async function getVideos(): Promise<Video[]> {
    if (!pool) {
        console.error("Database not connected.");
        return [];
    }
    try {
        const query = 'SELECT id, title, description, videoUrl, dataAiHint, IF(thumbnail IS NOT NULL, CONCAT("data:image/png;base64,", TO_BASE64(thumbnail)), NULL) as thumbnail FROM videos ORDER BY id ASC';
        const rows = await queryWithRetry<Video[]>(query);
        return rows as Video[];
    } catch (error) {
        console.error('Failed to fetch videos:', error);
        return [];
    }
}

export async function getVideoById(id: string): Promise<Video | null> {
    if (!pool) {
        console.error("Database not connected.");
        return null;
    }
    try {
        const rows = await queryWithRetry<Video[]>('SELECT * FROM videos WHERE id = ?', [id]);
        const videos = rows as Video[];
        
        if (!videos[0]) {
            return null;
        }

        const video = videos[0];
        // Ensure thumbnail is always a string
        if (video.thumbnail && Buffer.isBuffer(video.thumbnail)) {
            video.thumbnail = toDataURL(video.thumbnail);
        }
        
        return video;
    } catch (error) {
        console.error(`Failed to fetch video by id ${id}:`, error);
        return null;
    }
}

// Helper to extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

type SaveResult = { success: boolean; error?: string };

export async function saveVideo(formData: FormData, id?: string): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };

    const youtube_url = formData.get('youtube_url') as string;
    const videoId = getYouTubeVideoId(youtube_url);
    if (!videoId) {
        return { success: false, error: "অবৈধ ইউটিউব URL। সঠিক লিঙ্ক দিন।" };
    }
    
    const thumbnailFile = formData.get('thumbnail') as Blob | null;
    
    let thumbnailData: string | Buffer | null = null;
    if (thumbnailFile && thumbnailFile.size > 0) {
        thumbnailData = Buffer.from(await thumbnailFile.arrayBuffer());
    } else if (!id) { // Only apply default thumbnail on create
        thumbnailData = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    const videoToSave: {[key: string]: any} = {
        title: formData.get('title') as string,
        description: (formData.get('description') as string) || '',
        videoUrl: `https://www.youtube.com/embed/${videoId}`,
        dataAiHint: (formData.get('dataAiHint') as string) || 'youtube video',
    };
    
    if (thumbnailData) {
        videoToSave.thumbnail = thumbnailData;
    }

    try {
        if (id) {
            await queryWithRetry('UPDATE videos SET ? WHERE id = ?', [videoToSave, id]);
        } else {
            await queryWithRetry('INSERT INTO videos SET ?', [videoToSave]);
        }
        revalidatePath('/admin/gallery/videos');
        revalidatePath('/(site)/videos');
        revalidatePath('/(site)/');
        return { success: true };
    } catch (e: any) {
        console.error("Failed to save video:", e);
        return { success: false, error: e.message };
    }
}

export async function deleteVideo(id: string): Promise<SaveResult> {
    if (!pool) return { success: false, error: "Database not connected" };
    try {
        await queryWithRetry('DELETE FROM videos WHERE id = ?', [id]);
        revalidatePath('/admin/gallery/videos');
        revalidatePath('/(site)/videos');
        revalidatePath('/(site)/');
        return { success: true };
    } catch (e: any) {
        console.error("Failed to delete video:", e);
        return { success: false, error: e.message };
    }
}
