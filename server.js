const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const fetch = require('node-fetch');

process.on('uncaughtExceptions', (err) => {
	console.log(
		'UNCAUGHT EXCEPTIONS!😟😟 Shutting down....',
		err.name,
		err.message
	);
	process.exit(1);
});

const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.NODE_ENV === 'development' ? process.env.DATABASE_LOCAL : process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// console.log(DB);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: true,
		useUnifiedTopology: true,
	})
	.then((connection) => {
		console.log(`Connection success`);
	});

// let url = 'https://api.pepipost.com/v5/mail/send';

// let options = {
// 	method: 'POST',
// 	headers: {
// 		'Content-Type': 'application/json',
// 		api_key: `${process.env.NETCORE_API_KEY}`,
// 	},
// 	body: '{"from":{"email":"test@pepisandbox.com","name":"Pepi"},"subject":"Test email from Pepipost","content":[{"type":"html","value":"Hello, Welcome to Pepipost."}],"attachments":[{"name":"example.txt","content":"base64 encoded file content"}],"personalizations":[{"to":[{"email":"spiralforge.spiralforge@gmail.com","name":"Recipient Name"}]}]}',
// };

// fetch(url, options)
// 	.then((res) => res.json())
// 	.then((json) => console.log(json))
// 	.catch((err) => console.error('error:' + err));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`App running on port: ${port}....`);
});

process.on('unhandledRejection', (err) => {
	console.log(
		'UNHANDLED REJECTION!😟😟 Shutting down....',
		err.name,
		err.message,
		err.stack
	);
	server.close(() => {
		process.exit(1);
	});
});
