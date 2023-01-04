const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanatize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const contactRouter = require('./routes/contactRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour!',
});

// Express specific stuff
const app = express();
// Set template engine as pug
app.set('view engine', 'pug');
// Set the views directory
app.set('views', path.join(__dirname, 'views'));
// Set security HTTP headers
app.use(helmet());
// Set limit to requests from same IP
app.use('/api', limiter);
// Body parser,reading datafrom body intoreq.body
app.use(express.json({ limit: '10kb' }));
// Data sanitization against NoSQL query injection
app.use(mongoSanatize());
// Data sanitization against XSS attacks
app.use(xss());
// Protection against HTTP parameter pollution
app.use(
	hpp({
		whitelist: [
			'duration',
			'ratingsAverage',
			'ratingsQuantity',
			'maxGroupSize',
			'difficulty',
			'price',
		],
	})
);
// Servong static files
app.use(express.static(path.join(__dirname, './public')));

app.use('/api/v1/contacts', contactRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
	next(
		new AppError(`Can't find ${req.originalUrl} page on this server!`, 404)
	);
});

app.use(globalErrorHandler);

module.exports = app;
