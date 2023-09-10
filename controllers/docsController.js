const fs = require('fs');
const path = require('path');
const data = fs.readFileSync(path.join(__dirname, '../docs-data/overview.json'), 'utf-8');
const documentData = JSON.parse(data);
const Contact = require('./../models/contactModel');

const convertKeyToTitle = (key) => {
    const title = key.split('-').map((word) => {
        return word[0].toUpperCase() + word.slice(1);
    });
    return title.join(' ');
};

exports.getOverviewPage = (req, res) => {
	const overviewData = Object.entries(documentData).map(([key, value]) => {
		return {
			title: convertKeyToTitle(key),
            href: key,
			route: value.route,
			method: value.method,
			summary: value.summary,
		};
	});

	res.status(200).render('overview', {
		title: 'Documentation',
		routes: overviewData,
	});
};

exports.getRoutesPage = (req, res) => {
    const {id} = req.params;
    const routeData = documentData[id];
    
    res.status(200).render('routeDetails', {
        title: convertKeyToTitle(id),
        data: routeData,
    });
};

exports.protect = (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization || !authorization.startsWith('Bearer')) {
		return res.status(200).render('login', {
			title: 'Login',
			message: 'You are not logged in! Please log in to get access!',
		});
	}

	// const token = authorization.split(' ')[1];

	// if (token !== process.env.JWT_SECRET) {
	// 	return res.status(401).json({
	// 		status: 'fail',
	// 		message: 'Invalid token! Please log in again!',
	// 	});
	// }
};

exports.getPlaygroundPage = (req, res) => {
	res.status(200).render('playground', {
		title: 'Playground',
	});
}