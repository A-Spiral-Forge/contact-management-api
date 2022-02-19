const AppError = require('./../utils/appError');

const handleCastErrorDB = (error) => {
	const message = `Invalid ${error.path}: ${error.value}`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (error) => {
	const fieldValue = error.keyValue.name;
	const message = `User with name: '${fieldValue}' already exists, if you want to change please update existing contact!`;

	return new AppError(message, 400);
};

const handleValidationErrorDB = (error) => {
	const errors = Object.values(error.errors).map((el) => el.message);
	const message = `Input correct field values! ${errors.join('. ')}`;

	return new AppError(message, 400);
};

const handleJWTError = () =>
	new AppError('Invalid token. Please login again!', 401);

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		ok: false,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

const handleJWTExpiredError = () =>
	new AppError('Token expired. Please login again to continue!', 401);

const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			ok: false,
			message: err.message,
		});
	} else {
		console.error(`Error 🤧🤧:`, err);

		res.status(500).json({
			status: 'error',
			ok: false,
			message: 'Something went very wrong!',
		});
	}
};

module.exports = (err, _req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = { ...JSON.parse(JSON.stringify(err)) };
		if (error.name === 'CastError') error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldsDB(error);
		if (error.name === 'ValidationError')
			error = handleValidationErrorDB(error);
		if (error.name === 'JsonWebTokenError') error = handleJWTError();
		if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
		sendErrorProd(error, res);
	}

	next();
};
