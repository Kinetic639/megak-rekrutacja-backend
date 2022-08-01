import { HandlebarsAdapter } from '@nest-modules/mailer';
import { MAIL_SECRET } from './config/secrets';

export = {
  transport: {
    host: 'smtp.gmail.com',
    port: 465,
    ignoreTLS: true,
    secure: true,
    auth: {
      user: 'megakauth@gmail.com',
      pass: MAIL_SECRET,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },

  defaults: {
    from: 'megakauth@gmail.com',
  },
  template: {
    dir: './templates/email',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
