import { Injectable } from "@nestjs/common";
import { MailerService } from "../mailer/mailer.service";
import { ConfigService } from "@nestjs/config";
import { MailData } from "./interfaces/mail-data.interface";
import * as path from "path";

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

    async forgotPassword(
        mailData: MailData<{ resetToken: string }>
    ): Promise<void> {
        const resetUrl = `${this.configService.getOrThrow(
            "BASE_URL"
        )}/auth/forgot-password?resetToken=${mailData.data.resetToken}`;

        const message = `Your password reset token is:
${resetUrl} If you did not request this email, please ignore it.`;

        this.mailerService.sendMail({
            to: mailData.to,
            subject: "Password Reset",
            text: message,
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
                title: "Password Reset Token (valid for 15 minutes)",
                url: `${this.configService.get("BASE_URL", {
                    infer: true
                })}/auth/reset-password?resetToken=${mailData.data.resetToken}`,
                actionTitle: "Reset Password",
                app_name: this.configService.get("APP_NAME", { infer: true }),
                text1: "Reset!",
                text2: "Password Reset!"
            }
        });
    }

    async resetPassword(
        mailData: MailData<{ resetToken: string }>
    ): Promise<void> {
        const message = `
        Your password reset was successful. If you did not initiate this activity, please contact ${this.configService.getOrThrow(
            "EMAIL_USER"
        )}.
      `;

        this.mailerService.sendMail({
            to: mailData.to,
            subject: "Password Reset Successful",
            text: message,
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
                title: "Password Reset Successful",
                url: `${this.configService.get("BASE_URL", {
                    infer: true
                })}`,
                actionTitle: "Reset Password Successful",
                app_name: this.configService.get("APP_NAME", { infer: true }),
                text1: "Reset!",
                text2: "Password Reset Successful!"
            }
        });
    }
}
