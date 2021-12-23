import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	category: { type: String, default: 'unknown' },
	productImage: String,
	quantityAvailable: { type: Number, default: 1 },
	description: String,
	likes: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },],
	reviews: [
		{
			user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
			review: { type: String, required: true },
		},
	],
});

export default mongoose.model('Product', productSchema);
