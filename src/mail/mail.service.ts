import { Injectable } from "@nestjs/common";
import { MailerService } from "../mailer/mailer.service";
import { ConfigService } from "@nestjs/config";
import { MailData } from "./interfaces/mail-data.interface";
import path from "path";

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) {}

    async userSignUp(mailData: MailData<{ hash: string }>): Promise<void> {
        this.mailerService.sendMail({
            to: mailData.to,
            subject: "Confirmation Mail",
            text: `${this.configService.get("BASE_URL", {
                infer: true
            })}/auth/confirm-email?hash=${mailData.data.hash}`,
            templatePath: path.join(
                this.configService.getOrThrow("WORK_DIR", {
                    infer: true
                }),
                "src",
                "mail",
                "mail-templates",
                "activation.hbs"
            ),
            context: {
                title: "Confirmation Mail",
                url: `${this.configService.get("BASE_URL", {
                    infer: true
                })}/auth/confirm-email?hash=${mailData.data.hash}`,
                actionTitle: "Confirm email",
                app_name: this.configService.get("APP_NAME", { infer: true }),
                text1: "Welcome!",
                text2: "You’re almost ready to onboard!"
            }
        });
    }
}
