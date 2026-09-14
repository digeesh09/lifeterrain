import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Save to web app public dir
    const webUploadDir = join(process.cwd(), '../web/public/uploads');
    if (!fs.existsSync(webUploadDir)) {
      await mkdir(webUploadDir, { recursive: true });
    }
    await writeFile(join(webUploadDir, fileName), buffer);

    // Save to admin app public dir so admin can view it
    const adminUploadDir = join(process.cwd(), './public/uploads');
    if (!fs.existsSync(adminUploadDir)) {
      await mkdir(adminUploadDir, { recursive: true });
    }
    await writeFile(join(adminUploadDir, fileName), buffer);

    return NextResponse.json({ success: true, url: `/uploads/${fileName}` });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
