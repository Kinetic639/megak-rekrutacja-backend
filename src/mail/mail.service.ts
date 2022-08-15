import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(
    to: string,
    subject: string,
    link: string,
    text: string,
    buttonText: string,
  ): Promise<any> {
    await this.mailerService.sendMail({
      to,
      subject,
      html: `<!DOCTYPE html>
    <html lang="pl" xmlns="https://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com🏢office">
    
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="x-apple-disable-message-reformatting">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <title></title>
            <style>
                table {border-collapse:collapse;border-spacing:0;border:none;margin:0;}
                div, td {padding:0;}
                div {margin:0 !important;}
            </style>
         
        <style type="text/css">
        </style>
      </head>
    
      <body style="margin:0 auto;padding:0;word-spacing:normal;height:100%; max-width: 100%; background-color:#222224">
        <table role="presentation"
          style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width:100%; box-sizing: border-box; height:100%;"
          width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td width="100%" height="100%" style="text-align: center;">
              <table role="presentation"
                style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%"
                height="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" 
                    style="width:300px;height:300px;background-size: contain;background-repeat: no-repeat; background-position: center;  margin-left:auto; margin-right:auto;"
                    width="150px" background="https://platforma.megak.pl/public/ui/logo.png">
                  </td>
                </tr>
                <tr>
                  <td align="center" width="100%" style="padding: 0 5%;">
                    <header style="text-align: center;">
                      <h1 style="font-weight: 300; color: #CFCFCF;">Witaj na platformie HR kursu MegaK</h1>
                      <p style="margin: 0; font-size: 18px; color: #F7F7F7;">${text}.</p>
                    </header>
                  </td>
                </tr>
                <tr>
                  <td width="100%" style="width: 100%; font-size: 14px; padding:5vh 0;">
                    <main>
                      <div style="display: inline-block; width: 30%;">
                        <a href="${link}" target="_blank"
                          style="padding: 8px 12px; border: 1px solid #ED2939;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
                          ${buttonText}
                        </a>
                      </div>
                    </main>
                  </td>
                </tr>
    
              </table>
            </td>
          </tr>
        </table>
      </body>
 
    </html>`,
    });
  }
}
