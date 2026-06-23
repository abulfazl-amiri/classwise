import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a plain-text email through Resend.
 *
 * Requires RESEND_API_KEY in the environment.
 * Accepts `{ to, subject, message }` and returns Resend's send result.
 */
const sendEmail = async function ({ to, subject, message }) {
  return await resend.emails.send({
    from: "Classwise <onboarding@resend.dev>",
    to: to,
    subject: subject,
    text: message,
    html: `<p>${message}</p>`,
  });
};

export { sendEmail };
