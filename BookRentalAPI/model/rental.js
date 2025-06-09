import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
  bookId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', 
    required: true 
    },
  memberId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member', 
    required: true },
  rentalDate: { 
    type: Date, 
    default: Date.now 
  },
  dueDate: { 
    type: Date, 
    required: true },
  returnDate: { type: Date },
  fine: { 
    type: Number, 
    default: 0 },
  status: { 
    type: String, 
    enum: ['rented', 'returned'], 
    required: true }
});

export const rental =mongoose.model('Rental', rentalSchema);
