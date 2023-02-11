const express = require('express');
const contactController = require('./../controllers/contactController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
	.route('/')
	.get(contactController.getAllContacts)
	.post(contactController.createContact);

router
	.route('/multiple')
	.post(
		authController.restrictTo('admin'),
		contactController.createMultipleContacts
	);

router
	.route('/id/:id')
	.get(contactController.getContact)
	.patch(authController.restrictTo('admin'), contactController.updateContact)
	.delete(
		authController.restrictTo('admin'),
		contactController.deleteContact
	);

router
	.route('/username/:username')
	.get(contactController.getContactByUsername)

module.exports = router;
