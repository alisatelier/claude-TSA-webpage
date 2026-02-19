interface LayoutOptions {
  preheader?: string;
}

const UNSUBSCRIBE_BLOCK = `<tr>
            <td align="center" style="padding-top:16px;">
              <p style="margin:0;font-size:11px;color:#A69FA6;">
                <a href="https://www.thespiritatelier.ca/account/settings" style="color:#A69FA6;text-decoration:underline;">Unsubscribe</a>
                &nbsp;&middot;&nbsp;
                <a href="https://www.thespiritatelier.ca/account/settings" style="color:#A69FA6;text-decoration:underline;">Email Preferences</a>
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#c9c3c9;">
                The Spirit Atelier &middot; Calgary, AB &middot; Canada
              </p>
            </td>
          </tr>`;

export function emailLayoutShell(options: LayoutOptions = {}): string {
  const preheaderHtml = options.preheader
    ? `<div style="display:none;font-size:1px;color:#535B73;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${options.preheader}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#535B73 ; font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;">
  ${preheaderHtml}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;">
   <tr>
  <td align="center" 
      style="
        background-color:#535B73; 
        padding:24px 20px;
      ">

    <img 
      src="https://www.thespiritatelier.ca/images/the-spirit-atelier-email.png"
      alt="The Spirit Atelier — handcrafted spiritual tools for tarot, runes, and intentional practice"
      width="260"
      style="
        display:block;
        width:100%;
        max-width:260px;
        height:auto;
        margin:0 auto;
      "
    />

    <hr 
      style="
        border:none;
        border-top:1px solid #FEDDE8;
        margin:16px auto 0 auto;
        width:60px;
      "
    />

  </td>
</tr>

          <!-- Body -->
          <tr>
            <td style="padding:0 0 32px;color:#535B73;font-size:15px;line-height:1.7;">
              {{EMAIL_BODY}}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="border-top:1px solid #FEDDE8;padding-top:24px;">
              <p style="margin:0 0 8px;color:#A69FA6;font-size:13px;font-style:italic;">
                Sent with intention.
              </p>
              <p style="margin:0;color:#A69FA6;font-size:12px;">
                hello@thespiritatelier.ca
              </p>
            </td>
          </tr>

          <!-- Unsubscribe — non-removable -->
          ${UNSUBSCRIBE_BLOCK}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const BODY_PLACEHOLDER = "{{EMAIL_BODY}}";

export function emailLayout(body: string, options: LayoutOptions = {}): string {
  return emailLayoutShell(options).replace(BODY_PLACEHOLDER, body);
}

export function fillPlaceholders(
  body: string,
  variables: Record<string, string>,
): string {
  return body.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    key in variables ? variables[key] : match,
  );
}
