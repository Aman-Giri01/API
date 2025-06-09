import { Router } from "express";
import * as book from '../controller/bookControler.js'

const router=new Router();

router
.route('/books')
.post(book.addBook);

router
.route('/books/:id')
.put(book.updateBook)

router
.route('/books/low-stock')
.get(book.lowStock);
export const route=router;

// Member Route

router.route('/members')
.post(book.addMemeber)

router.route('/members/:id')
.put(book.updateMember);

// Rental

router.route('/rental')
.post(book.rentBook);

router.route('/rental/:id/return')
.patch(book.returnBook);

// Report

router
.route('/reports/members/:id/fine')
.get(book.fineSummary);

router
.route('/reports/members/:id/history')
.get(book.memberHistory)

router
.route('/reports/top-rented')
.get(book.topRented);

router.get('/reports/overdue', book.overdueRentals);