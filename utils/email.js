const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(' ')[0];
		this.url = url;
		this.from = `SpiralForge <${process.env.EMAIL_FROM}>`;
	}

	newTransport() {
		if (process.env.NODE_ENV === 'production') {
			return nodemailer.createTransport({
				service: 'SendGrid',
				auth: {
					user: process.env.SENDGRID_USERNAME,
					pass: process.env.SENDGRID_PASSWORD,
				},
			});
		}

		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});
	}

	async send(templateName, subject) {
		const html = pug.renderFile(
			`${__dirname}/../views/${templateName}.pug`,
			{
				firstName: this.firstName,
				url: this.url,
				subject: subject,
			}
		);

		const mailOptions = {
			from: this.from,
			to: this.to,
			subject: subject,
			html,
			text: htmlToText.htmlToText(html),
		};

		await this.newTransport().sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send('welcome', 'Welcome to the world of contacts');
	}

	async sendPasswordReset() {
		await this.send(
			'passwordReset',
			'Your password reset token (valid for only 10 minutes)'
		);
	}
};