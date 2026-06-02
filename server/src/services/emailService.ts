import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const FEEDBACK_RECIPIENT_EMAIL = process.env.FEEDBACK_RECIPIENT_EMAIL!;
const APP_URL = process.env.APP_URL ?? 'http://localhost:3000';

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

interface DeletionAlertPayload {
  userEmail: string;
  userName: string;
  reason: string | null;
  comment: string | null;
  transactionCount: number;
  daysSinceSignup: number;
  hadCompletedOnboarding: boolean;
  locale: 'he' | 'en';
}

export const sendDeletionAlert = async (
  payload: DeletionAlertPayload
): Promise<{ delivered: boolean; reason?: string }> => {
  if (!process.env.RESEND_API_KEY) {
    return { delivered: false, reason: 'RESEND_API_KEY not configured' };
  }

  const text = `User account deleted.

User:        ${payload.userName} <${payload.userEmail}>
Reason:      ${payload.reason ?? 'not selected'}
Comment:     ${payload.comment ?? 'none'}

Transactions:      ${payload.transactionCount}
Days since signup: ${payload.daysSinceSignup}
Onboarded:         ${payload.hadCompletedOnboarding ? 'yes' : 'no'}
Locale:            ${payload.locale}
`;

  try {
    await resend.emails.send({
      from: 'Lyra <hello@send.lyra-il.com>',
      to: FEEDBACK_RECIPIENT_EMAIL,
      subject: `[Lyra] User deleted: ${payload.userEmail}`,
      text,
    });

    return { delivered: true };
  } catch (err) {
    console.error('Failed to send deletion alert email:', err);
    return {
      delivered: false,
      reason: err instanceof Error ? err.message : 'unknown',
    };
  }
};

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
    from: 'Lyra <hello@send.lyra-il.com>',
    to: FEEDBACK_RECIPIENT_EMAIL,
    subject: '[Lyra] New feedback',
    text,
  });
};

interface WorkspaceRemovalEmailPayload {
  to: string;
  workspaceName: string;
}

const renderRemovalHtml = (workspaceName: string): string => {
  const safeName = workspaceName
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body dir="rtl" style="margin:0;padding:0;background-color:#f3f1fb;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f1fb;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="420" cellpadding="0" cellspacing="0" border="0" style="max-width:420px;width:100%;background-color:#ffffff;border:1px solid #e6e3f4;border-radius:16px;">
            <tr>
              <td align="center" style="padding:18px 24px;border-bottom:1px solid #eeeeee;">
                <span style="font-size:18px;font-weight:700;color:#1a1a1a;">Lyra</span>
              </td>
            </tr>
            <tr>
              <td align="right" style="padding:28px;font-size:15px;line-height:1.6;color:#1a1a1a;">
                הוסרת ממשק הבית המשותף "<strong>${safeName}</strong>".
                <br/><br/>
                <span style="color:#555;">
                  לא תהיה לך יותר גישה לנתונים של משק הבית הזה. הנתונים שיצרת
                  עדיין נשמרים שם עבור החברים הנותרים.
                </span>
              </td>
            </tr>
            <tr>
              <td align="right" style="border-top:1px solid #eeeeee;padding:18px 28px;font-size:12px;color:#888;">
                אם יש שאלות, אפשר לפנות אלינו דרך האפליקציה.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

export const sendWorkspaceRemovalNotification = async (
  payload: WorkspaceRemovalEmailPayload
): Promise<{ delivered: boolean; reason?: string }> => {
  if (!process.env.RESEND_API_KEY) {
    return { delivered: false, reason: 'RESEND_API_KEY not configured' };
  }

  const text = `הוסרת ממשק הבית המשותף "${payload.workspaceName}" ב-Lyra.

לא תהיה לך יותר גישה לנתונים של משק הבית הזה. הנתונים שיצרת עדיין נשמרים שם עבור החברים הנותרים.`;

  try {
    await resend.emails.send({
      from: 'Lyra <hello@send.lyra-il.com>',
      to: payload.to,
      subject: `הוסרת ממשק הבית "${payload.workspaceName}" ב-Lyra`,
      html: renderRemovalHtml(payload.workspaceName),
      text,
    });

    return { delivered: true };
  } catch (err) {
    console.error('Failed to send workspace removal email:', err);
    return {
      delivered: false,
      reason: err instanceof Error ? err.message : 'unknown',
    };
  }
};

interface WorkspaceInvitationEmailPayload {
  to: string;
  inviterName: string;
  workspaceName: string;
  workspaceIcon?: string;
  token: string;
}

const HOUSEHOLD_ICON_TO_EMOJI: Record<string, string> = {
  Home: '🏠',
  House: '🏡',
  HomeWork: '🏘️',
  Apartment: '🏢',
  Cottage: '🏡',
  Cabin: '🛖',
  Villa: '🏛️',
  Castle: '🏰',
  AccountBalance: '🏦',
  FamilyRestroom: '👨‍👩‍👧',
  Groups: '👥',
  Diversity3: '🤝',
  Favorite: '❤️',
  Star: '⭐',
  Pets: '🐾',
  Yard: '🌳',
  BeachAccess: '🏖️',
  Forest: '🌲',
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderInvitationHtml = (params: {
  inviterName: string;
  workspaceName: string;
  emoji: string;
  link: string;
}): string => {
  const inviterName = escapeHtml(params.inviterName);
  const workspaceName = escapeHtml(params.workspaceName);
  const link = escapeHtml(params.link);
  const emoji = params.emoji;

  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light" />
    <title>Lyra</title>
  </head>
  <body dir="rtl" style="margin:0;padding:0;background-color:#f3f1fb;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f1fb;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;width:100%;background-color:#ffffff;border:1px solid #e6e3f4;border-radius:16px;">
            <tr>
              <td align="center" valign="middle" style="background-color:#3B3792;padding:18px 24px;border-top-left-radius:16px;border-top-right-radius:16px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td valign="middle" style="padding-left:10px;">
                      <img src="https://lyra-il.com/lyraIcon.png" alt="" width="28" height="28" style="display:block;border:0;outline:none;text-decoration:none;width:28px;height:28px;" />
                    </td>
                    <td valign="middle" style="font-size:18px;font-weight:600;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
                      Lyra
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="right" style="padding:28px 28px 20px 28px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td valign="middle" width="56" style="width:56px;padding-left:14px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td align="center" valign="middle" width="56" height="56" style="width:56px;height:56px;background-color:#7F77DD;border-radius:14px;font-size:26px;line-height:56px;text-align:center;color:#ffffff;">
                            ${emoji}
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td valign="middle" align="right">
                      <div style="font-size:21px;font-weight:600;color:#1a1a1a;line-height:1.2;">${workspaceName}</div>
                      <div style="font-size:13px;color:#888888;margin-top:4px;">משק בית משותף</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="right" style="padding:0 28px 24px 28px;font-size:15px;line-height:1.6;color:#555555;">
                ${inviterName} מזמין/ה אותך לנהל יחד את משק הבית ב-Lyra. תוכלו לעקוב אחרי ההוצאות וההכנסות במקום אחד.
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 16px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" bgcolor="#7F77DD" style="background-color:#7F77DD;border-radius:10px;">
                      <a href="${link}" style="display:block;padding:14px 24px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">
                        הצטרפו למשק הבית
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="right" style="padding:0 28px 24px 28px;font-size:12px;color:#999999;line-height:1.6;">
                או העתיקו את הקישור:
                <a href="${link}" style="color:#7F77DD;text-decoration:none;word-break:break-all;">${link}</a>
              </td>
            </tr>
            <tr>
              <td align="right" style="border-top:1px solid #eeeeee;padding:18px 28px;font-size:12px;color:#888888;line-height:1.6;border-bottom-left-radius:16px;border-bottom-right-radius:16px;">
                ההזמנה בתוקף ל-7 ימים. אם לא ציפיתם להזמנה, אפשר להתעלם מהמייל.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const renderInvitationText = (params: {
  inviterName: string;
  workspaceName: string;
  link: string;
}): string =>
  `${params.inviterName} מזמין/ה אותך לנהל יחד את משק הבית "${params.workspaceName}" ב-Lyra.

הצטרפו דרך הקישור הבא:
${params.link}

ההזמנה בתוקף ל-7 ימים. אם לא ציפיתם להזמנה, אפשר להתעלם מהמייל.`;

export const sendWorkspaceInvitation = async (
  payload: WorkspaceInvitationEmailPayload
): Promise<{ delivered: boolean; reason?: string }> => {
  if (!process.env.RESEND_API_KEY) {
    return { delivered: false, reason: 'RESEND_API_KEY not configured' };
  }

  const link = `${APP_URL}/invitations/${payload.token}`;
  const emoji =
    (payload.workspaceIcon && HOUSEHOLD_ICON_TO_EMOJI[payload.workspaceIcon]) ?? '🏠';

  const html = renderInvitationHtml({
    inviterName: payload.inviterName,
    workspaceName: payload.workspaceName,
    emoji,
    link,
  });
  const text = renderInvitationText({
    inviterName: payload.inviterName,
    workspaceName: payload.workspaceName,
    link,
  });

  try {
    await resend.emails.send({
      from: 'Lyra <hello@send.lyra-il.com>',
      to: payload.to,
      subject: 'הוזמנת למשק בית משותף ב-Lyra',
      html,
      text,
    });

    return { delivered: true };
  } catch (err) {
    console.error('Failed to send workspace invitation email:', err);
    return {
      delivered: false,
      reason: err instanceof Error ? err.message : 'unknown',
    };
  }
};
