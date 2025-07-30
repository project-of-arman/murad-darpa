
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;

    if (!pool) {
        return new NextResponse('Database not connected', { status: 500 });
    }

    try {
        const [rows] = await pool.query<any[]>('SELECT file_data, file_name FROM notices WHERE id = ?', [id]);
        
        if (rows.length === 0 || !rows[0].file_data) {
            return new NextResponse('File not found', { status: 404 });
        }

        const { file_data, file_name } = rows[0];
        const buffer = Buffer.from(file_data);
        
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${encodeURIComponent(file_name || 'notice.pdf')}"`,
            },
        });
    } catch (error) {
        console.error('Failed to retrieve notice file:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
