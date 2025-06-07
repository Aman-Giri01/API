import { Router } from "express";
import * as item from "../controller/itemController.js"

const router=new Router();

router
.route("/item")
.post(item.addItem)

router
.route("/item/:id")
.put(item.updateItem)

router.route("/item/:id/restock")
.patch(item.restock);

router.route("/item/:id/sell")
.patch(item.sellItem);

// router.route("item/:id/logs")
// .get(item.getLog)

router.route("/item/:id/logs")
.get(item.getLog);

router.route("/item/low-stock")
.get(item.lowStockItems);


export const stockRoute=router;