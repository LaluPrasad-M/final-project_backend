import mongoose from 'mongoose';

import User from '../models/users.js';
import Products from '../models/products.js';

const get_users = async (req, res, next) => {
	try {
		let users = await User.find({ role: 'user' }).select("name email isBlocked created");
		res.status(200).json({ success: true, data: users });
	} catch (err) {
		next(err);
	}
};

const get_user_by_id = async (req, res, next) => {
	try {
		res.status(200).json({ success: true, data: req.userData });
	} catch (err) {
		next(err);
	}
};

const get_cart_items = async (req, res, next) => {
	try {
		let { cart_items } = await User.findById(req.userData._id).select('cart_items').populate('cart_items');
		res.status(200).json({ success: true, data: cart_items });
	} catch (err) {
		next(err);
	}
};

const post_login = async (req, res, next) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		if (user.role !== req.query.role) {
			var error = Error("Please login with a valid user")
			error.status = 401;
			throw error
		}
		const token = await user.generateAuthToken();

		console.log({ success: true, token, user });
		return res.status(200).json({ success: true, token, user });
	} catch (err) {
		next(err);
	}
};

const post_logout = async (req, res, next) => {
	try {

		console.log({ success: true, message: 'logged out successfully' });
		return res.status(200).json({ success: true, message: 'logged out successfully' });
	} catch (err) {
		next(err);
	}
};

const post_register = async (req, res, next) => {
	var user = new User(req.body);
	try {
		user = await user.save();
		const token = await user.generateAuthToken();

		console.log({ success: true, token, user });
		return res.status(201).json({ success: true, token, user });
	} catch (err) {
		next(err);
	}
};

const add_to_cart = async (req, res, next) => {
	try {
		let user = await User.findByIdAndUpdate(req.userData._id, { $addToSet: { cart_items: req.params.product_id } });
		if (user) {
			res.status(200).json({ success: true, message: 'Product added to cart' });
		} else {
			const error = new Error('User not found');
			error.status = 404;
			throw error;
		}
	} catch (err) {
		next(err);
	}
};

const remove_from_cart = async (req, res, next) => {
	try {
		let user = await User.findByIdAndUpdate(req.userData._id, { $pull: { cart_items: req.params.product_id } });
		if (user) {
			res.status(200).json({ success: true, message: 'Product added to cart' });
		} else {
			const error = new Error('User not found');
			error.status = 404;
			throw error;
		}
	} catch (err) {
		next(err);
	}
};



const delete_user = async (req, res, next) => {
	try {
		let result = await User.findOneAndDelete({ _id: mongoose.Types.ObjectId(req.userData._id) });
		// TODO Check for these conditions
		if (result.deletedCount) {
			res.status(200).json({ message: 'User Deleted' });
		} else {
			const error = new Error('User not found');
			error.status = 404;
			throw error;
		}
	} catch (error) {
		next(err);
	}
};

const update_user_details = async (req, res, next) => {
	try {
		let user = await User.findById(req.userData.id);
		if (!user) {
			const error = new Error('User not found');
			error.status = 404;
			throw error;
		}
		let { name, email } = req.body;
		if (name) user.name = name;
		if (email) user.email = email;
		await user.save();
		res.json({ success: true, data: user });
	} catch (error) {
		next(error);
	}
};

const block_unblock_user = async (req, res, next) => {
	try {
		let user = await User.findById(req.params.user_id);
		user.isBlocked = !user.isBlocked;
		if (user.isBlocked) {
			res.status(200).json({ success: true, message: 'user blocked successfully' });
		} else {
			res.status(200).json({ success: true, message: 'user Unblocked successfully' });
		}
		await user.save();
	} catch (error) {
		next(error);
	}
};

export default {
	get_user_by_id,
	get_users,
	get_cart_items,
	post_login,
	post_logout,
	post_register,
	add_to_cart,
	remove_from_cart,
	delete_user,
	update_user_details,
	block_unblock_user,
};
