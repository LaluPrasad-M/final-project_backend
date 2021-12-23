import Product from '../models/products.js';

const get_products = async (req, res) => {
	try {
		const products = await Product.find()

		res.status(200).json({ success: true, data: products });

	} catch (err) {
		next(err);
	}
};

const get_product_details = async (req, res, next) => {
	try {
		let product = await Product.findById(req.params.id).populate("reviews.user", "-_id name");
		res.status(200).json({ success: true, data: product });
	} catch (err) {
		next(err);
	}
};

const add_product = async (req, res, next) => {
	try {
		const product = new Product(req.body);
		await product.save();
		console.log({ success: true, data: product });
		res.status(201).json({ success: true, data: product });
	} catch (err) {
		next(err);
	}
};

const add_review = async (req, res, next) => {
	try {
		let product = await Product.findById(req.params.id);
		product.reviews = [{ user: req.userData._id, review: req.body.review }].concat(product.reviews);
		await product.save();
		res.status(200).json({ success: true, message: 'Review added' });
	} catch (err) {
		next(err);
	}
};

const update_product_details = async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			const error = new Error('Product Id is Invalid');
			error.status = 400;
			throw error;
		}

		product.name = req.body.name
		product.price = req.body.price
		product.category = req.body.category
		product.productImage = req.body.productImage
		product.quantityAvailable = req.body.quantityAvailable
		product.description = req.body.description

		await product.save();
		res.status(200).json({ success: true, message: 'Product is updated' });
	} catch (err) {
		next(err);
	}
};

const delete_product = async (req, res, next) => {
	try {
		await Product.findByIdAndRemove(req.params.id);
		res.status(200).json({ success: true, message: 'Product is deleted' });
	} catch (err) {
		next(err);
	}
};
const like_unlike_products = async (req, res, next) => {
	try {
		let { product_id } = req.params;
		let { _id } = req.userData;
		var product = await Product.findById(product_id)
		if (product.likes.includes(_id)) {
			product.likes = product.likes.filter(like => like.toString() !== _id.toString());
		} else {
			product.likes.push(_id)
		}
		await product.save()
		res.status(200).json({ success: true, message: 'Success' });
	} catch (error) {
		next(err);
	}
};
export default {
	get_products,
	get_product_details,
	add_product,
	add_review,
	update_product_details,
	like_unlike_products,
	delete_product,
};
