import {Schema} from "mongoose";
import { model } from "mongoose";


const userSchema = new Schema({
    name:{type:String,required:true},
    userName:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    userRole:{type:String,required:true}
});
const user = model('UserDetail',userSchema);

const bookSchema = new Schema({
    image:String,
    bookTitle:{type:String,required:true},
    author:{type:String,required:true},
    description:{type:String,required:true},
    bookId:{type:String,required:true,unique:true},
    publisher:{type:String,required:true},
    yearOfPublication:Date,
    numberOfCopies:{type:Number,required:true},
});
const book = model('BookDetail',bookSchema );

const borrowSchema = new Schema({
    userName: { type: String, required: true },
    book: { type: Schema.Types.ObjectId, ref: 'BookDetail', required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true }, // When it should be returned
    actualReturnDate: { type: Date } // When it was actually returned (null if not returned)
});

const borrow = model('BorrowDetail', borrowSchema);

const returnSchema = new Schema({
    userName: { type: String, required: true }, 
    bookId: { type: String, required: true }, 
    borrowDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },  // Date when the book was supposed to be returned
    returnDate: { type: Date, default: Date.now }, // Actual return date
    fineAmount: { type: Number, default: 0 },  // Calculated fine (10 rupees per week late)
    isLate: { type: Boolean, default: false }   // Flag if returned late
});
const returnBook = model('ReturnBookDetail', returnSchema);

export  {user,book,borrow,returnBook}