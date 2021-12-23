import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

import userRoutes from './app/routes/users.js';
import productRoutes from './app/routes/products.js';
// import cartRoutes from "./app/routes/cart";

const MONGODB_URL = 'mongodb+srv://user01:1234@sweet-orders-cluster.0apdk.mongodb.net/finalProject?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URL);
const PORT = 3030;

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/user', userRoutes);
app.use('/product', productRoutes);
// app.use("/cart", cartRoutes);

app.use((req, res, next) => {
	const error = new Error('Url Not Found! Invalid URL!');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		success: false,
		message: error.message,
	});
});

const conn = mongoose.connection;
conn.once(
	'open',
	() => {
		console.log('DB Connection Successful');
		app.listen(PORT, () => {
			console.log(`Server is Running on PORT: ${PORT}`);
		});
	},
	error => {
		console.log(error.message);
	}
);
