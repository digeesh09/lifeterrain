import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import fs from 'fs';

// OWASP Security Constraints
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB to allow videos
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'video/mp4', 'video/webm'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.mp4', '.webm'];

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // 1. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'File size exceeds 50MB limit' }, { status: 413 });
    }

    // 2. Validate MIME Type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Invalid file type. Only JPG, PNG, WEBP, PDF, and MP4/WEBM are allowed.' }, { status: 415 });
    }

    // 3. Validate Extension
    const originalName = file.name || 'unnamed';
    const ext = extname(originalName).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ success: false, error: 'Invalid file extension.' }, { status: 415 });
    }

    // 4. Sanitize File Name (prevent path traversal & XSS)
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '');
    if (sanitizedName.length === 0 || sanitizedName === ext) {
      return NextResponse.json({ success: false, error: 'Invalid file name.' }, { status: 400 });
    }
    const safeFileName = `${Date.now()}-${sanitizedName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to web app public dir
    const webUploadDir = join(process.cwd(), '../web/public/uploads');
    if (!fs.existsSync(webUploadDir)) {
      await mkdir(webUploadDir, { recursive: true });
    }
    await writeFile(join(webUploadDir, safeFileName), buffer);

    // Save to admin app public dir
    const adminUploadDir = join(process.cwd(), './public/uploads');
    if (!fs.existsSync(adminUploadDir)) {
      await mkdir(adminUploadDir, { recursive: true });
    }
    await writeFile(join(adminUploadDir, safeFileName), buffer);

    return NextResponse.json({ success: true, url: `/uploads/${safeFileName}` });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'Server error during upload' }, { status: 500 });
  }
}
