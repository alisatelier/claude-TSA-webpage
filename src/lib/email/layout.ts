interface LayoutOptions {
  preheader?: string;
}

export function emailLayout(body: string, options: LayoutOptions = {}): string {
  const preheaderHtml = options.preheader
    ? `<div style="display:none;font-size:1px;color:#FFF8F0;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${options.preheader}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#FFF8F0;font-family:Georgia,serif;">
  ${preheaderHtml}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF8F0;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <h1 style="margin:0;font-family:Georgia,serif;font-size:22px;letter-spacing:3px;color:#535B73;font-weight:normal;">
                THE SPIRIT ATELIER
              </h1>
              <hr style="border:none;border-top:1px solid #FEDDE8;margin:16px auto 0;width:80px;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:0 0 32px;color:#535B73;font-size:15px;line-height:1.7;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="border-top:1px solid #FEDDE8;padding-top:24px;">
              <p style="margin:0 0 8px;color:#A69FA6;font-size:13px;font-style:italic;">
                Sent with intention.
              </p>
              <p style="margin:0;color:#A69FA6;font-size:12px;">
                hello@thespiritatelier.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
