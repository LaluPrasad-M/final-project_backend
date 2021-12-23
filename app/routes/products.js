import express from 'express';
import ProductController from "../controllers/products.js";
import checkAuthentication from "./middlewares/checkAuthentication.js";

const router = express.Router();

router.get("/", ProductController.get_products);

router.get("/:id", ProductController.get_product_details);


router.post("/", checkAuthentication.isValidAdmin, ProductController.add_product);

router.post("/:id/review", checkAuthentication.isValidUser, ProductController.add_review);


router.put("/:id", checkAuthentication.isValidAdmin, ProductController.update_product_details);

// localhost:3030/user/likes/619938b216fa2044bc39a768?like=true
router.post('/likes/:product_id', checkAuthentication.isValidUser, ProductController.like_unlike_products);

router.delete('/:id', checkAuthentication.isValidAdmin, ProductController.delete_product);

export default router;