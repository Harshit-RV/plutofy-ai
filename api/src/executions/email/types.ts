export interface EmailSmtpProps {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface SendEmailProps {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}
