const crypto = require('crypto');
const mongoose = require('mongoose');
// const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		require: [true, 'Please provide your name'],
	},
	email: {
		type: String,
		require: [true, 'Please provide your email address'],
		unique: [true, 'Account with this email address already exists'],
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email address'],
	},
	photo: {
		type: String,
	},
	role: {
		type: String,
		enum: ['user', 'guide', 'lead-guide', 'admin'],
		default: 'user',
	},
	password: {
		type: String,
		required: [true, 'Please provide your password'],
		minlength: 8,
		select: false,
	},
	passwordConfirm: {
		type: String,
		require: [true, 'Please provide your password for confimation'],
		validate: {
			validator: function (value) {
				return value === this.password;
			},
			message: 'Password not matched. Re-enter your password',
		},
	},
	passwordChangedAt: {
		type: Date,
	},
	passwordResetToken: {
		type: String,
	},
	passwordResetExpires: {
		type: Date,
	},
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
});

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000;
	next();
});

UserSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

UserSchema.pre('find', function (next) {
	this.find({ role: { $ne: 'admin' } });
	next();
});

UserSchema.methods.correctPassword = function (
	candidatePassword,
	userPassword
) {
	return bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);

		return JWTTimestamp < changedTimestamp;
	}

	return false;
};

UserSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
