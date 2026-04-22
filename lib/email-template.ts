export interface ContactFormData {
  firstName: string;
  lastName:  string;
  email:     string;
  subject:   string;
  phone:     string;
  website?:  string;
  message:   string;
}

function row(label: string, value: string, accent = false): string {
  return `
    <tr>
      <td style="
        padding: 14px 20px;
        vertical-align: top;
        width: 140px;
        min-width: 140px;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #6b7280;
        border-right: 2px solid #f3f4f6;
        white-space: nowrap;
      ">${label}</td>
      <td style="
        padding: 14px 20px;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 14px;
        color: ${accent ? "#2563eb" : "#111827"};
        line-height: 1.6;
        word-break: break-word;
      ">${value}</td>
    </tr>
  `;
}

function divider(): string {
  return `<tr><td colspan="2" style="padding: 0; height: 1px; background: #f3f4f6;"></td></tr>`;
}

export function buildEmailHtml(data: ContactFormData): string {
  const {
    firstName, lastName, email,
    subject, phone, website, message,
  } = data;

  const submittedAt = new Date().toLocaleString("en-US", {
    weekday: "long",
    year:    "numeric",
    month:   "long",
    day:     "numeric",
    hour:    "2-digit",
    minute:  "2-digit",
    timeZoneName: "short",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Form Submission</title>
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #f8fafc;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 16px;">
    <tr>
      <td align="center">

        <!-- Outer card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px;">

          <!-- Top accent bar -->
          <tr>
            <td style="
              background: linear-gradient(90deg, #1d4ed8 0%, #3b82f6 60%, #93c5fd 100%);
              height: 4px;
              border-radius: 12px 12px 0 0;
            "></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="
              background-color: #ffffff;
              padding: 36px 36px 28px;
              border-left: 1px solid #e5e7eb;
              border-right: 1px solid #e5e7eb;
            ">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <!-- Logo / brand mark -->
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="
                          background-color: #2563eb;
                          border-radius: 10px;
                          width: 36px;
                          height: 36px;
                          text-align: center;
                          vertical-align: middle;
                        ">
                          <span style="
                            color: #ffffff;
                            font-size: 16px;
                            font-weight: 800;
                            letter-spacing: -0.5px;
                            line-height: 36px;
                            display: inline-block;
                          ">I</span>
                        </td>
                        <td style="padding-left: 12px; vertical-align: middle;">
                          <span style="
                            font-size: 15px;
                            font-weight: 700;
                            color: #111827;
                            letter-spacing: -0.3px;
                          ">Ikhtiyaar</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="
                      display: inline-block;
                      background-color: #eff6ff;
                      color: #2563eb;
                      font-size: 11px;
                      font-weight: 700;
                      letter-spacing: 0.07em;
                      text-transform: uppercase;
                      padding: 5px 12px;
                      border-radius: 100px;
                      border: 1px solid #bfdbfe;
                    ">New Inquiry</span>
                  </td>
                </tr>
              </table>

              <!-- Heading -->
              <h1 style="
                margin: 24px 0 6px;
                font-size: 22px;
                font-weight: 800;
                color: #111827;
                letter-spacing: -0.5px;
                line-height: 1.2;
              ">New Contact Form Submission</h1>
              <p style="
                margin: 0;
                font-size: 14px;
                color: #6b7280;
                line-height: 1.5;
              ">
                Someone filled out the contact form on your website. All details are below.
              </p>
            </td>
          </tr>

          <!-- Sender summary banner -->
          <tr>
            <td style="
              background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
              padding: 20px 36px;
              border-left: 1px solid #e5e7eb;
              border-right: 1px solid #e5e7eb;
              border-top: 1px solid #e0f2fe;
              border-bottom: 1px solid #e0f2fe;
            ">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 2px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #6b7280;">From</p>
                    <p style="margin: 0; font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.3px;">
                      ${firstName} ${lastName}
                    </p>
                    <p style="margin: 4px 0 0;">
                      <a href="mailto:${email}" style="
                        font-size: 13px;
                        color: #2563eb;
                        text-decoration: none;
                        font-weight: 500;
                      ">${email}</a>
                    </p>
                  </td>
                  <td align="right" style="vertical-align: top;">
                    <p style="margin: 0; font-size: 11px; color: #9ca3af; text-align: right; line-height: 1.5;">
                      ${submittedAt}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Data table -->
          <tr>
            <td style="
              background-color: #ffffff;
              border-left: 1px solid #e5e7eb;
              border-right: 1px solid #e5e7eb;
              padding: 8px 36px 0;
            ">
              <p style="
                margin: 20px 0 12px;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: #9ca3af;
              ">Submission Details</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="
                border: 1px solid #f3f4f6;
                border-radius: 10px;
                overflow: hidden;
                border-collapse: separate;
                border-spacing: 0;
              ">
                ${row("Subject", subject)}
                ${divider()}
                ${row("Phone", phone)}
                ${divider()}
                ${website ? `${row("Website", `<a href="${website}" style="color:#2563eb;text-decoration:none;">${website}</a>`, true)}${divider()}` : ""}
                ${row("Reply-to", `<a href="mailto:${email}" style="color:#2563eb;text-decoration:none;">${email}</a>`, true)}
              </table>
            </td>
          </tr>

          <!-- Message block -->
          <tr>
            <td style="
              background-color: #ffffff;
              padding: 20px 36px 32px;
              border-left: 1px solid #e5e7eb;
              border-right: 1px solid #e5e7eb;
            ">
              <p style="
                margin: 0 0 12px;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: #9ca3af;
              ">Message</p>

              <div style="
                background-color: #f9fafb;
                border: 1px solid #f3f4f6;
                border-left: 3px solid #2563eb;
                border-radius: 0 10px 10px 0;
                padding: 18px 20px;
                font-size: 14px;
                color: #374151;
                line-height: 1.75;
                white-space: pre-wrap;
                word-break: break-word;
              ">${message}</div>

              <!-- Reply CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                <tr>
                  <td style="
                    background-color: #2563eb;
                    border-radius: 8px;
                  ">
                    <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="
                      display: inline-block;
                      padding: 12px 24px;
                      font-size: 13px;
                      font-weight: 700;
                      color: #ffffff;
                      text-decoration: none;
                      letter-spacing: 0.02em;
                    ">Reply to ${firstName} →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              background-color: #f9fafb;
              padding: 20px 36px;
              border: 1px solid #e5e7eb;
              border-top: none;
              border-radius: 0 0 12px 12px;
            ">
              <p style="
                margin: 0;
                font-size: 12px;
                color: #9ca3af;
                line-height: 1.6;
              ">
                This is an automated notification from your website contact form.
                Do not reply to this email directly — use the button above to contact ${firstName}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}