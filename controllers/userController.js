const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const handlerFactory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
	const filteredObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) filteredObj[el] = obj[el];
	});
	return filteredObj;
};

exports.getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError(
				'This route is not for password modification. Please use /updatePassword for passoword updation.',
				400
			)
		);
	}

	const filteredBody = filterObj(req.body, 'name', 'email');
	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		filteredBody,
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(200).json({
		status: 'success',
		ok: true,
		data: {
			user: updatedUser,
		},
	});
});

exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });

	res.status(204).json({
		status: 'success',
		ok: true,
		data: null,
	});
});

exports.createUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		ok: false,
		message: 'This route is not defined! Please use /signup instead.',
	});
};

exports.getUser = handlerFactory.getOne(User);
exports.getAllUsers = handlerFactory.getAll(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
