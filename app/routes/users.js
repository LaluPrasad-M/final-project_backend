import express from 'express';
import UserController from '../controllers/users.js';
import checkAuthentication from './middlewares/checkAuthentication.js';

const router = express.Router();

// const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuthentication.isValidAdmin, UserController.get_users);

router.get('/cart', checkAuthentication.isValidUser, UserController.get_cart_items);

// router.get('/userProfile', checkAuthentication.isValidUser, UserController.get_user_by_id);

router.get('/adminProfile', checkAuthentication.isValidAdmin, UserController.get_user_by_id);

router.post('/login', UserController.post_login);

router.post('/logout', UserController.post_logout);

router.post('/register', UserController.post_register);

router.post('/cart/:product_id/remove', checkAuthentication.isValidUser, UserController.remove_from_cart);

router.post('/cart/:product_id', checkAuthentication.isValidUser, UserController.add_to_cart);


router.delete('/', checkAuthentication.isValidUser, UserController.delete_user);

router.put('/', checkAuthentication.isValidUser, UserController.update_user_details);

router.put('/:user_id/disable', checkAuthentication.isValidAdmin, UserController.block_unblock_user);

export default router;
