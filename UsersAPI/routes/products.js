import {Router} from "express";
import * as product from "../controller/product.js";


const router= new Router();

router
.route("/products")
.get(product.viewProducts)
.post(product.addProduct);

router
.route("/products/:id")
.get(product.getProductById)

router
.route("/update/:id")
.put(product.updateProduct)

router
.route("/delete/:id")
.delete(product.deleteProduct)



export const prodRoute=router;

