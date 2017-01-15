const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Products = require('../db/products');
const To = require('../To');

router.get('/', (req, res) => {
	res.render("products", { "allProducts": true, "product": Products.all() });
});

router.get('/test', (req, res) => {
	let productListData = Products.all();
	res.json({ "success": true, "product list": productListData });
});

router.get('/new', (req, res) => {
	res.render("products", { "newProduct": true, "product": { "err": false } });
});

router.get('/new/err', (req, res) => {
	res.render("products", { "newProduct": true, "product": { "err": true } });
});

router.get('/:id', (req, res) => {
	let urlID = req.params.id;
	let productData = Products.getByID(urlID);
	res.render("products", { "oneProduct": true, "product": productData });
});

router.get('/:id/test', (req, res) => {
	let productData = Products.getByID(req.params.id);
	res.json({ "success": true, "product": productData });
});

router.get('/:id/edit', (req, res) => {
	res.render("products", { "editProduct": true, "product": Products.getByID(req.params.id) });
});

router.post('/', (req, res) => {
	function success() {
		console.log("SUCCESS!!!!");
		res.render("products", { "allProducts": true, "product": Products.all() });
	}
	function failure() {
		res.redirect(303, `/products/new/err`);
	}
	Products.add(req.body, success, failure);
});

router.post('/test', (req, res) => {
	function success(newProduct) {
		res.json({ "success": true, "new product": newProduct });
	}
	function failure() {
		res.json({ "success": false });
	}
	Products.add(req.body, success, failure);
});

router.put('/:id', (req, res) => {
	for(key in req.body) {
		if(req.body[key] === "") {
			req.body[key] = undefined;
		}
	}
	function success() {
		let urlID = req.params.id;
		let productData = Products.getByID(urlID);
		res.render("products", { "oneProduct": true, "product": productData });
	}
	function failure() {
		let productData = Products.getByID(req.params.id);
		productData.err = true;
		res.render("products", { "editProduct": true, "product": productData });
	}
	Products.editByID(req.body, success, failure);
});

router.put('/:id/test', (req, res) => {
	function success() {
		res.json({ "success": true, "edited product": Products.getByID(req.params.id) });
	}
	function failure() {
		res.json({ "success": false });
	}
	Products.editByID(req.body, success, failure);
});

router.delete('/:id', (req, res) => {
	function success() {
		res.redirect(303, `/products`);
	}
	function failure() {
		res.redirect(303, `/products/${req.body.id}`);
	}
	Products.deleteByID(req.body, success, failure);
});

router.delete('/:id/test', (req, res) => {
	function success() {
		res.json({ "success": true, "new product list": Products.all() });
	}
	function failure() {
		res.json({ "success": false });
	}
	Products.deleteByID(req.body, success, failure);
});

module.exports = router;