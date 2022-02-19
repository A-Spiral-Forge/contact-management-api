class APIFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		const queryObj = { ...this.queryString };

		// 1A) Filtering Data
		const excludedFieled = ['page', 'sort', 'limit', 'fields'];
		excludedFieled.forEach((field) => delete queryObj[field]);

		// 1B) Advance Filtering
		const queryStr = JSON.stringify(queryObj).replace(
			/\b(gte|lte|lt|gt)\b/g,
			(match) => `$${match}`
		);

		this.query = this.query.find(JSON.parse(queryStr));
		// let query = Tour.find(JSON.parse(queryStr));

		return this;
	}

	sort() {
		// 2) Sorting wrt some query string
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createdAt');
		}

		return this;
	}

	fieldLimit() {
		// 3) Field limiting
		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(',').join(' ');
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select('-__v');
		}

		return this;
	}

	pagination() {
		// 4) Pagination
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 5;
		const skip = (page - 1) * limit;

		this.query.skip(skip).limit(limit);

		return this;
	}
}

module.exports = APIFeatures;
