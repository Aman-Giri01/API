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
.get(products.getAllProductsTesting);



export const routes = router;