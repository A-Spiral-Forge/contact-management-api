const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');

const signToken = (id) =>
	jwt.sign({ _id: id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

	res.cookie('jwt', token, cookieOptions);

	user.password = undefined;
	res.status(statusCode).json({
		status: 'success',
		ok: true,
		token,
		data: {
			user: user,
		},
	});
};

exports.signup = catchAsync(async (req, res, next) => {
	// req.body.role = undefined;
	const newUser = await User.create(req.body);

	const profileUrl = `${req.protocol}://${req.get('host')}/me`;
	
	const email = new Email(newUser, profileUrl);
	await email.sendWelcome();

	createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(
			new AppError('Please provide a valid email and password', 400)
		);
	}

	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError('Incorrect email or password', 401));
	}

	createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer ')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return next(
			new AppError(
				'You are not logged in. Please login to continue.',
				401
			)
		);
	}

	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	const currentUser = await User.findById(decoded._id);
	if (!currentUser) {
		return next(
			new AppError('The user belonging to the token does not exist.', 401)
		);
	}

	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError('Password changed recently. Please login again.', 401)
		);
	}

	req.user = currentUser;

	next();
});

// eslint-disable-next-line arrow-body-style
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new AppError(
					'You have not permission to perform this action.',
					403
				)
			);
		}

		next();
	};
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(
			new AppError('No user found with this email address.', 404)
		);
	}

	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	const resetURL = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/users/resetPassowrd/${resetToken}`;

	const message = `Forget your password? No worries, you can reset your password by clicking on this link: ${resetURL}.\n If you did not want simply ignore this mail.`;

	try {
		const email = new Email(user, resetURL);

		await email.sendPasswordReset();

		res.status(200).json({
			status: 'success',
			ok: true,
			message: 'Token sent successfully to your email address!',
		});
	} catch (error) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		// return next(new AppError('Error sending email. Try again later!', 500));
		return next(error);
	}
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	if (!user) {
		return next(new AppError('Token is invalid or expired', 400));
	}

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password');

	if (
		!(await user.correctPassword(req.body.passwordCurrent, user.password))
	) {
		return next(new AppError('Incorrect current password', 401));
	}

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	await user.save();

	createSendToken(user, 200, res);
});
