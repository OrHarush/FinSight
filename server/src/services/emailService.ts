import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

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
    from: 'FinSight <onboarding@resend.dev>',
    to: 'finsight.dev@gmail.com',
    subject: '[FinSight] New feedback',
    text,
  });
};
