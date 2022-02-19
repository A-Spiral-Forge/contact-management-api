const mongoose = require('mongoose');
const dotenv = require('dotenv');

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

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
);
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

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`App running on port: ${port}....`);
});

process.on('unhandledRejection', (err) => {
	console.log(
		'UNHANDLED REJECTION!😟😟 Shutting down....',
		err.name,
		err.message
	);
	server.close(() => {
		process.exit(1);
	});
});
