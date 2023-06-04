export interface Mail {
  session: {
    expiresAt: string;
    mails: MailData[];
  };
}

export interface MailData {
  rawSize: number;
  fromAddr: string;
  toAddr: string;
  downloadUrl: string;
  text: string;
  headerSubject: string;
}
