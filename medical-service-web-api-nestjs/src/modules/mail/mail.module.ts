import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER || 'apikey',
          pass: process.env.MAIL_PASS || 'your-sendgrid-api-key',
        },
      },
      defaults: {
        from: process.env.MAIL_FROM || 'thanhhien.work.2004@gmail.com',
      },
      template: {
        dir: join(__dirname, '..','..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
