
import nodemailer from "nodemailer";
import { EmailSmtpProps, SendEmailProps } from "./types";

class EmailService {
  transporter: nodemailer.Transporter;

  constructor(data: EmailSmtpProps) {
    this.transporter = nodemailer.createTransport({
      host: data.smtpServer,
      port: data.port,
      secure: data.port === 465,
      auth: {
        user: data.username,
        pass: data.password,
      },
    });
  }

  sendEmail = async (data: SendEmailProps) => {
    await this.transporter.sendMail({
      from: data.from,
      to: data.to,
      subject: data.subject,
      html: data.html,
    })
  } 
}

export default EmailService;