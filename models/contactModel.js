const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const contactsSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Contact details must have a name'],
		unique: [true, 'Name of contact must be unique'],
		maxlength: [50, 'Maximum length of name is 50 characters'],
		validate: {
			validator: function (value) {
				return validator.isAlpha(value, 'en-US', {
					ignore: ' ',
				});
			},
			message: 'Name must only contains Alphabates',
		},
	},
	mobileNumber: {
		type: [
			{
				type: String,
				validate: [
					validator.isMobilePhone,
					'Specified mobile number is not valid',
				],
			},
		],
		validate: {
			validator: function (val) {
				return val.length > 0 && new Set(val).size === val.length;
			},
			message:
				'Must have minimum one number and all numbers must be unique for a contact',
		},
	},
	company: {
		type: {
			name: {
				type: String,
				required: [true, 'Company name is required'],
				maxlength: [50, 'Maximum length of company name is 50 characters'],
				validate: {
					validator: function (value) {
						return validator.isAlpha(value, 'en-US', {
							ignore: ' ',
						});
					},
					message: 'Company name must only contains Alphabates',
				},
			},
			slug: String,
			website: {
				type: String,
				validate: {
					validator: function (value) {
						return validator.isURL(value, {
							protocols: ['http', 'https'],
							require_protocol: true,
						});
					},
					message: 'Website must be a valid URL',
				},
			},
			position: {
				type: String,
				maxlength: [50, 'Maximum length of position is 50 characters'],
				validate: {
					validator: function (value) {
						return validator.isAlpha(value, 'en-US', {
							ignore: ' ',
						});
					},
					message: 'Position must only contains Alphabates',
				},
			},
		},
	},
	email: {
		type: [
			{
				type: String,
			},
		],
		validate: {
			validator: function (val) {
				return new Set(val).size === val.length;
			},
			message: 'All emails must be unique for a contact',
		},
	},
	address: {
		type: String,
	},
	faxNumber: {
		type: [
			{
				type: String,
			},
		],
		validate: {
			validator: function (val) {
				return new Set(val).size === val.length;
			},
			message: 'All fax numbers must be unique for a contact',
		},
	},
	telNumber: {
		type: [
			{
				type: String,
			},
		],
		validate: {
			validator: function (val) {
				return new Set(val).size === val.length;
			},
			message: 'All telephone numbers must be unique for a contact',
		},
	},
});

const Contact = mongoose.model('Contact', contactsSchema);

module.exports = Contact;
