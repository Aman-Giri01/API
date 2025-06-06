import { Router } from "express";
import * as register from "../controller/register.js"

const router=new Router();

router
.route('/register')
.post(register.registerUser);

router
.route('/login')
.post(register.loginUser);

router
.route('/logout')
.post(register.LogoutUser);

export const routes =router;