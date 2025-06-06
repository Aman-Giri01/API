// import express from 'express';
// const router= express.Router();

import {Router} from 'express';
import * as products from '../controllers/products.js';
const router= new Router();

router
.route("/")
.get(products.getAllProducts);

router
.route("/testing")
.get(products.getAllProductsTesting)
.post(products.addProduct)


router
.route("/testing/:id")
.put(products.updateProducts)
.delete(products.deleteProducts);



export const routes = router;