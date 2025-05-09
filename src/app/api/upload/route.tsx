import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(500).json({ message: 'Upload failed', error: err });
    }

    const questionId = parseInt(
      Array.isArray(fields.questionId) ? fields.questionId[0] : fields.questionId || '',
      10
    );
    const clientId = Array.isArray(fields.clientId) ? fields.clientId[0] : fields.clientId;
    const file = files.file?.[0] || files.file;

    if (!file || Array.isArray(file) || !clientId || !questionId) {
      return res.status(400).json({ message: 'Missing file, clientId, or questionId' });
    }

    const originalPath = file.filepath;
    const newFileName = `${Date.now()}-${file.originalFilename}`;
    const newFilePath = path.join(uploadDir, newFileName);
    const publicFilePath = `/uploads/${newFileName}`;

    const readStream = fs.createReadStream(originalPath);
    const writeStream = fs.createWriteStream(newFilePath);

    readStream.pipe(writeStream);

    writeStream.on('close', async () => {
      await prisma.intakeAnswer.create({
        data: {
          questionId,
          clientId,
          answer: publicFilePath,
        },
      });

      return res.status(200).json({
        message: 'File uploaded and saved',
        filePath: publicFilePath,
      });
    });

    writeStream.on('error', (error) => {
      console.error('Stream error:', error);
      return res.status(500).json({ message: 'Stream error', error });
    });
  });
}
