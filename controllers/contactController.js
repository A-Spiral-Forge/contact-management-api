const Contact = require('../models/contactModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getAllContacts = factory.getAll(Contact);
exports.getContact = factory.getOne(Contact);
exports.createContact = factory.createOne(Contact);
exports.createMultipleContacts = factory.createMany(Contact);
exports.updateContact = factory.updateOne(Contact);
exports.deleteContact = factory.deleteOne(Contact);
