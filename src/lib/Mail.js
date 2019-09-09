import Nodemailer from 'nodemailer';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';
import mail from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mail;
    this.transporter = Nodemailer.createTransport({ host, port, secure, auth });
    this.templates();
  }

  templates() {
    const view_path = resolve(__dirname, '..', 'app', 'views', 'emails');
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(view_path, 'layouts'),
          partialsDir: resolve(view_path, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath: view_path,
        extName: '.hbs',
      })
    );
  }

  sendMail(message) {
    return this.transporter.sendMail({ ...mail.default, ...message });
  }
}

export default new Mail();
