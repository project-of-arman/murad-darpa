
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toBuffer = async (file: File): Promise<Buffer> => {
    const bytes = await file.arrayBuffer();
    return Buffer.from(bytes);
};

export function toDataURL(buffer: Buffer, mimeType: string = 'image/png'): string {
  if (Buffer.isBuffer(buffer)) {
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  }
  // If it's already a string (like from a mock data), return it as is.
  return buffer as unknown as string;
}
