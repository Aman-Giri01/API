import { Router } from "express";
import * as equip from "../controller/equipController.js"

const router =new Router();

router
.route('/equip')
.post(equip.addEquip);

router.route('/equip/:id')
.put(equip.updateEquip);

router.route('/equip/low-stock')
.get(equip.lowStock);

// User Management

router.route('/users')
.post(equip.addUser);

router.route('/users/:id')
.put(equip.updateUser)

// Loan Management
router
.route('/loans')
.get(equip.getEquip)
.post(equip.rentEquip);

router
.route('/loans/:id/return')
.patch(equip.returnEquip);

// Reports
router
.route('/reports/overdue')
.get(equip.overdue);

router
.route('/reports/top-loaned')
.get(equip.topRented);

router.route('/reports/user/:id/history')
.get(equip.history);

export const route=router;