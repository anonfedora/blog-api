import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import * as fs from "node:fs/promises";
import Handlebars from "handlebars";

@Injectable()
export class MailerService {
    private readonly transporter: nodemailer.Transporter;
    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: configService.get("EMAIL_HOST", { infer: true }),
            port: configService.get("EMAIL_PORT", { infer: true }),
            auth: {
                user: configService.get("EMAIL_USER", { infer: true }),
                pass: configService.get("EMAIL_PASSWORD", { infer: true })
            }
        });
    }

    async sendMail({
        templatePath,
        context,
        ...mailOptions
    }: nodemailer.SendMailOptions & {
        templatePath: string;
        context: Record<string, unknown>;
    }) {
        //
        let html: string | undefined;
        console.log(templatePath)
        if (templatePath) {
            const template = await fs.readFile(templatePath, "utf-8");
            html = Handlebars.compile(template, {
                strict: true
            })(context);
        }

        await this.transporter.sendMail({
            ...mailOptions,
            from: mailOptions.from
                ? mailOptions.from
                : `"${this.configService.get("EMAIL_NAME", {
                      infer: true
                  })}" <${this.configService.get("EMAIL_USER", {
                      infer: true
                  })}>`,
            html: mailOptions.html ? mailOptions.html : html
        });
    }
}
