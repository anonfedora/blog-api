import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [ConfigModule, MailerModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
