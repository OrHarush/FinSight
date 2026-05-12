import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const FEEDBACK_RECIPIENT_EMAIL = process.env.FEEDBACK_RECIPIENT_EMAIL!;

interface FeedbackEmailPayload {
  message: string;
  email?: string;
  userId?: string;
  metadata: {
    route: string;
    month?: number;
    year?: number;
    accountId?: string;
  };
}

export const sendFeedback = async (payload: FeedbackEmailPayload) => {
  const text = `
Message:
${payload.message}

User email:
${payload.email ?? 'not provided'}

Context:
Route: ${payload.metadata.route}
`;

  await resend.emails.send({
    from: 'Lyra <onboarding@resend.dev>',
    to: FEEDBACK_RECIPIENT_EMAIL,
    subject: '[Lyra] New feedback',
    text,
  });
};
