const Contact = require('../models/contactModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getContactByUsername = catchAsync(async (req, res, next) => {
    let query = Contact.findOne({linkedinURL: `https://www.linkedin.com/in/${req.params.username}/`});

    const doc = await query;

    if (!doc)
        return next(
            new AppError(`Can't find any Contact with this LinkedIn Username`, 404)
        );

    res.status(200).json({
        status: 'success',
        ok: true,
        data: {
            doc,
        },
    });
});

exports.getAllContacts = factory.getAll(Contact);
exports.getContact = factory.getOne(Contact);
exports.createContact = factory.createOne(Contact);
exports.createMultipleContacts = factory.createMany(Contact);
exports.updateContact = factory.updateOne(Contact);
exports.deleteContact = factory.deleteOne(Contact);
