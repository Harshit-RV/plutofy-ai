export interface EmailSmtpProps {
  smtpServer: string;
  port: number;
  username: string;
  password: string;
}

export interface SendEmailProps {
  from: string;
  to: string;
  subject: string;
  html: string;
}
