const express = require('express');
const contactController = require('./../controllers/contactController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
	.route('/')
	.get(contactController.getAllContacts)
	.post(authController.protect, contactController.createContact);

router.use(authController.protect);

router
	.route('/multiple')
	.post(
		authController.restrictTo('admin'),
		contactController.createMultipleContacts
	);

router
	.route('/:id')
	.get(contactController.getContact)
	.patch(authController.restrictTo('admin'), contactController.updateContact)
	.delete(
		authController.restrictTo('admin'),
		contactController.deleteContact
	);

module.exports = router;
