const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAll = (Model) =>
	catchAsync(async (req, res, next) => {
		const features = new APIFeatures(Model.find(), req.query)
			.filter()
			.sort()
			.fieldLimit()
			.pagination();
		const docs = await features.query;

		res.status(200).json({
			status: 'success',
			ok: true,
			results: docs.length,
			data: {
				data: docs,
			},
		});
	});

exports.getOne = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		if (popOptions && popOptions.path) query = query.populate(popOptions);

		const doc = await query;

		const docName = Model.collection.collectionName.slice(0, -1);

		if (!doc)
			return next(
				new AppError(`Can't find any ${docName} with this ID`, 404)
			);

		res.status(200).json({
			status: 'success',
			ok: true,
			data: {
				doc,
			},
		});
	});

exports.createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const newDoc = await Model.create(req.body);

		res.status(201).json({
			status: 'success',
			ok: true,
			data: {
				data: newDoc,
			},
		});
	});

exports.createMany = (Model) =>
	catchAsync(async (req, res, next) => {
		const newDoc = await Model.create(req.body);

		res.status(201).json({
			status: 'success',
			ok: true,
			data: {
				data: newDoc,
			},
		});
	});

exports.updateOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		const docName = Model.collection.collectionName.slice(0, -1);

		if (!doc)
			return next(
				new AppError(`Can't find any ${docName} with this ID`, 404)
			);

		res.status(202).json({
			status: 'success',
			ok: true,
			data: {
				data: doc,
			},
		});
	});

exports.deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);
		const docName = Model.collection.collectionName.slice(0, -1);

		if (!doc)
			return next(
				new AppError(`Can't find any ${docName} with this ID`, 404)
			);

		res.status(204).json({
			status: 'success',
			ok: true,
			data: null,
		});
	});
