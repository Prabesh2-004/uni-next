// app/api/send-email/route.ts
import { Resend } from "resend";

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const body = await req.json();

  if (!body.email) {
    return Response.json({ error: "Email required" }, { status: 400 });
  }

  const { data, error } = await resend.emails.send({
    from: "UniNext <no-reply@prabeshlamichhane2004.com.np>",
    to: [body.email],
    subject: "Booking Confirmation",
    html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="600" style="background: #ffffff; border-radius: 10px; overflow: hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background: #2563eb; padding: 20px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 20px;">Booking Confirmed 🎉</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 20px; color: #333;">
                <p style="margin: 0 0 10px;">Hello <strong>${body.name}</strong>,</p>
                
                <p style="margin: 0 0 15px;">
                  Your booking with <strong>${body.counselorName}</strong> has been confirmed.
                </p>

                <table width="100%" style="background: #f9fafb; padding: 15px; border-radius: 8px;">
                  <tr>
                    <td><strong>Date:</strong></td>
                    <td>${body.date}</td>
                  </tr>
                  <tr>
                    <td><strong>Time:</strong></td>
                    <td>${body.time}</td>
                  </tr>
                </table>

                <p style="margin-top: 20px;">
                  If you have any questions, feel free to reply to this email.
                </p>

                <p style="margin-top: 20px;">Thanks,<br/>UniNext Team</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background: #f1f5f9; text-align: center; padding: 15px; font-size: 12px; color: #777;">
                © ${new Date().getFullYear()} UniNext. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `,
  });

  console.log("RESEND RESPONSE:", data, error);

  return Response.json({ data, error });
}
