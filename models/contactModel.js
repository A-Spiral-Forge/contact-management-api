const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const ContactsSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Contact details must have a name'],
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
	linkedinURL: {
		type: String,
		required: [true, 'LinkedIn profile is required'],
		unique: [true, 'LinkedIn profile already exists with this URL.'],
		validate: [
			{
				validator: function (value) {
					return validator.isURL(value, {
						protocols: ['http', 'https'],
						require_protocol: true,
					});
				},
				message: 'LinkedIn profile must be a valid URL',
			},
			{
				validator: function(value) {
					const res = /https:\/\/www\.linkedin\.com\/in\/.+\//i;
					return res.test(value);
				},
				message: 'LinkedIn URL must ends with a / and in corrext format',
			},
		],
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
							ignore: " .'-",
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
							ignore: " .'",
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
				validate: {
					validator: validator.isEmail,
					message: 'Please check the list of emails.'
				}
			},
		],
		validate: {
			validator: function (val) {
				return val.length > 0 && new Set(val).size === val.length;
			},
			message: 'Must have minimum one number and all numbers must be unique for a contact',
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

const Contact = mongoose.model('Contact', ContactsSchema);

module.exports = Contact;
