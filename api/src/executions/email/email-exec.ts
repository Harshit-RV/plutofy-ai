
import nodemailer from "nodemailer";
import { EmailSmtpProps, SendEmailProps } from "./types";

class EmailExec {
  transporter: nodemailer.Transporter;

  constructor(data: EmailSmtpProps) {
    this.transporter = nodemailer.createTransport({
      host: data.host,
      port: data.port,
      secure: data.secure,
      auth: {
        user: data.auth.user,
        pass: data.auth.pass,
      },
    });
  }

  sendEmail = async (data: SendEmailProps) => {
    await this.transporter.sendMail({
      from: data.from,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    })
  } 
}

export default EmailExec;