import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_KEY = 'final_assignment';

const UserSchema = new mongoose.Schema({
	name: { type: String, required: [true, 'Name cannot be Empty'], trim: true },
	salt: { type: String },
	role: { type: String, default: 'user', enum: ['user', 'admin'] },
	cart_items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
	isBlocked: { type: Boolean, default: false },
	email: {
		type: String,
		unique: true,
		required: [true, 'E-mail cannot be Empty'],
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('Email is invalid');
			}
		},
	},
	password: {
		type: String,
		required: [true, 'Password cannot be Empty'],
		minlength: [6, 'Password must contain at-least six characters'],
		trim: true,
		validate(value) {
			if (value.toLowerCase().includes('password')) {
				throw new Error('Password cannot contain "password"');
			}
		},
	},
}, {
	timestamps: true
});
/*----------------------------CUSTOM STATIC METHODS------------------------------------*/

UserSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email, isBlocked: false });
	console.log(password, user)

	if (!user) {
		let error = new Error('Unable to login. Please check you email and password.');
		error.status = 401;
		throw error;
	}
	console.log(password, user.password)
	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		let error = new Error('Unable to login. Please check you email and password.');
		error.status = 401;
		throw error;
	}

	return user;
};

/*----------------------------CUSTOM PROTOTYPE METHODS------------------------------------*/

UserSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.salt;

	return userObject;
};

UserSchema.methods.generateAuthToken = async function () {
	const user = this;
	console.log(user);
	const token = jwt.sign({ _id: user._id.toString() }, JWT_KEY, {
		expiresIn: '3h',
	});

	return token;
};

/*--------------------------PRE EVENTS------------------------------------------*/

// Hash the plain text password before saving
UserSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('password')) {
		user.salt = await bcrypt.genSalt(15);
		user.password = await bcrypt.hash(user.password, user.salt);
	}
	next();
});

/*-------------------------------------------------------------------------------*/

var User = mongoose.model('User', UserSchema);

export default User;
