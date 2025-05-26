import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

type EmailOptions = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
    text,
  });
}
