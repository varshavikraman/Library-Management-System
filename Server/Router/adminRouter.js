import { Router } from "express";
import authenticate from "../Middleware/auth.js";
import adminCheck from "../Middleware/adminAuth.js";
import { user,book,borrow,returnBook } from "../Models/sample.js";
import upload from "../Middleware/upload.js";

const adminRoute = Router();

const convertToBase64 = (buffer) => {
    return buffer.toString("base64");
};

adminRoute.post('/addBook', authenticate, adminCheck, upload.single("bookImage"), async (req, res) => {
    try {
        const { BookTitle, Author, Description, BookId, Publisher, YearOfPublication, NumberOfCopies } = req.body;
        const Books = await book.findOne({ bookId: BookId });
        if (Books) {
            res.status(400).json({ msg: `${BookTitle} already exists` });
        } else {
            let ImageFile = "";
            if (req.file) {
                ImageFile = convertToBase64(req.file.buffer);
            }
            const newBook = new book({
                image: ImageFile,
                bookTitle: BookTitle,
                author: Author,
                description: Description,
                bookId: BookId,
                publisher: Publisher,
                yearOfPublication: new Date(YearOfPublication), 
                numberOfCopies: NumberOfCopies,
            });
            await newBook.save();
            res.status(201).json({ msg: `${BookTitle} added successfully` });
            console.log(newBook);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg:"Internal Server Error"});
    }
});

adminRoute.get('/getAllBooks', async (req, res) => {
    try {
        const bookDatas = await book.find();
        console.log("Fetched Books:", bookDatas); 
        res.json(bookDatas);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

adminRoute.get('/getBook', async (req, res) => {
    try {
        let title = req.query.bookTitle;
        console.log("Requested book:", `"${title}"`);

        if (!title) {
            return res.status(400).json({ msg: "Book title is required" });
        }

        const result = await book.findOne({ bookTitle: title }); 
        if (!result) {
            return res.status(404).json({ msg: "No such book available" });
        }

        res.status(200).json({
            imageUrl: `/api/getBookImage?bookTitle=${encodeURIComponent(title)}`,
            bookTitle: result.bookTitle,
            author: result.author,
            description: result.description,
            bookId: result.bookId,
            publisher: result.publisher,
            yearOfPublication: result.yearOfPublication,
            numberOfCopies: result.numberOfCopies,
        });

    } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

adminRoute.get('/getBookImage', async (req, res) => {
    try {
        let title = req.query.bookTitle;
        console.log("Requested Book Title:", `"${title}"`);

        if (!title) {
            return res.status(400).json({ msg: "Book Title is required" });
        }

        const bookDetails = await book.findOne({ bookTitle: title });

        if (!bookDetails || !bookDetails.image) {
            return res.status(404).json({ msg: `No image available for book: ${title}` });
        }

        res.set("Content-Type", "image/jpeg");
        res.send(Buffer.from(bookDetails.image, "base64"));

    } catch (error) {
        console.error("Error fetching book image:", error.message);
        res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
});

adminRoute.get('/bookDetails/:bookId', async (req, res) => {
    try {
        const { bookId } = req.params;
        if (!bookId) {
            return res.status(400).json({ message: "BookId is required" });
        }

        const result = await book.findOne({ bookId });;    
        if (result) {
            console.log(result);
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Book not available" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update the updateBookCopies route to use bookId instead of title
adminRoute.patch('/updateBookCopies', authenticate, adminCheck, async (req, res) => {
    try {
        const { BookId, NumberOfCopies } = req.body;
        
        // Validate input
        if (typeof NumberOfCopies !== 'number' || NumberOfCopies < 0) {
            return res.status(400).json({ msg: "Invalid number of copies" });
        }

        const result = await book.findOneAndUpdate(
            { bookId: BookId },
            { $set: { numberOfCopies: NumberOfCopies } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ msg: `Book with ID "${BookId}" not found` });
        }

        res.status(200).json({ 
            msg: "Copies updated successfully",
            bookTitle: result.bookTitle,
            newCopies: result.numberOfCopies
        });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ 
            msg: "Internal Server Error", 
            error: error.message 
        });
    }
});
    
adminRoute.delete('/deleteBook', authenticate, adminCheck, async (req, res) => {
    try {
        const { BookId } = req.body;
        console.log("Deleting book with ID:", BookId);

        const result = await book.findOne({ bookId: BookId });

        if (!result) {
            return res.status(404).json({ msg: `Book with ID ${BookId} does not exist` });
        }

        await book.findOneAndDelete({ bookId: BookId });

        res.status(200).json({ msg: `${result.bookTitle} has been deleted successfully` });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
});

adminRoute.get('/getUser', authenticate, async (req, res) => {
    try {
        console.log("Decoded User ID:", req.user_id);

        const userId = req.user_id;

        const userData = await user.findById(userId)

        if (!userData) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.status(200).json(userData);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

adminRoute.post('/issueBook', authenticate, adminCheck, async (req, res) => {
    try {
        const { BookId, DateofIssue, DateofReturn } = req.body;
        const userId = req.user_id;

        const userData = await user.findById(userId);
        if (!userData) {
            return res.status(404).json({ msg: "User not found" });
        }

        const bookData = await book.findOne({ bookId: BookId });
        if (!bookData || bookData.numberOfCopies <= 0) {
            return res.status(400).json({ msg: "Book not available" });
        }

        // Parse dates with proper timezone handling
        const issueDate = new Date(DateofIssue);
        const dueDate = new Date(DateofReturn); // Now represents dueDate
        const now = new Date();

        // Adjust for timezone offset
        const adjustedIssueDate = new Date(issueDate.getTime() - issueDate.getTimezoneOffset() * 60000);
        const adjustedDueDate = new Date(dueDate.getTime() - dueDate.getTimezoneOffset() * 60000);
        const adjustedNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

        // Validate dates (compare date portions only)
        if (adjustedIssueDate < adjustedNow.setHours(0,0,0,0) || 
            adjustedDueDate <= adjustedIssueDate) {
            return res.status(400).json({ 
                msg: "Invalid date range",
                details: {
                    issueDate: adjustedIssueDate,
                    dueDate: adjustedDueDate,
                    now: adjustedNow
                }
            });
        }

        const newBorrowed = new borrow({
            userName: userData.userName,
            book: bookData._id,
            borrowDate: adjustedIssueDate,
            dueDate: adjustedDueDate, // Changed from returnDate to dueDate
            // actualReturnDate will be null by default
        });

        await newBorrowed.save();
        await book.updateOne({ _id: bookData._id }, { $inc: { numberOfCopies: -1 } });

        res.status(201).json({ 
            msg: "Book borrowed successfully!", 
            data: {
                ...newBorrowed.toObject(),
                dueDate: adjustedDueDate.toISOString().split('T')[0] // Format for frontend
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
});

adminRoute.get('/getBorrowedBooks', authenticate, async (req, res) => {
    try {
        const userName = req.Name;
        
        // Only find books that haven't been returned (actualReturnDate doesn't exist)
        const borrowedBooks = await borrow.find({ 
            userName,
            actualReturnDate: { $exists: false }
        }).populate({
            path: 'book',
            model: 'BookDetail',
            select: 'bookId bookTitle author'
        }).exec();

        if (!borrowedBooks || borrowedBooks.length === 0) {
            return res.status(200).json({ 
                borrowDetails: [],
                userName: req.Name
            });
        }

        const formattedBorrowDetails = borrowedBooks.map(record => ({
            _id: record._id,
            bookId: record.book.bookId,
            bookInfo: {
                bookTitle: record.book.bookTitle,
                author: record.book.author,
                borrowDate: record.borrowDate.toISOString().split('T')[0],
                dueDate: record.dueDate.toISOString().split('T')[0], // Changed from returnDate
                // Don't include actualReturnDate since we're only querying unreturned books
            }
        }));

        res.status(200).json({
            borrowDetails: formattedBorrowDetails,
            userName: req.Name
        });

    } catch (error) {
        console.error('Error fetching borrowed books:', error);
        res.status(500).json({
            msg: 'Server error while fetching borrowed books'
        });
    }
});

adminRoute.post('/returnBook', authenticate, adminCheck, async (req, res) => {
    try {
        const { userName, bookId } = req.body;

        // Find user and book
        const userData = await user.findOne({ userName });
        if (!userData) {
            return res.status(404).json({ msg: "User not found" });
        }

        const bookData = await book.findOne({ bookId });
        if (!bookData) {
            return res.status(404).json({ msg: "Book not found" });
        }

        // Find the active borrow record (where actualReturnDate doesn't exist)
        const borrowedBook = await borrow.findOne({ 
            userName: userData.userName, 
            book: bookData._id,
            actualReturnDate: { $exists: false } // Changed from returnDate
        }).populate('book');

        if (!borrowedBook) {
            return res.status(404).json({ msg: "No active borrow record found" });
        }

        // Calculate fine based on dueDate (not borrowDate + 14 days)
        const returnDate = new Date();
        let fineAmount = 0;
        let isLate = false;
        
        if (returnDate > borrowedBook.dueDate) {
            isLate = true;
            const diffTime = Math.abs(returnDate - borrowedBook.dueDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const weeksLate = Math.ceil(diffDays / 7);
            fineAmount = weeksLate * 10;
        }

        // Create return record
        const newReturn = new returnBook({
            userName: userData.userName,
            bookId: bookData.bookId,
            borrowDate: borrowedBook.borrowDate,
            expiryDate: borrowedBook.dueDate, // Using dueDate from borrow record
            returnDate: returnDate,
            fineAmount,
            isLate
        });

        // Update database
        await newReturn.save();
        // Set actualReturnDate instead of returnDate
        await borrow.findByIdAndUpdate(borrowedBook._id, { actualReturnDate: returnDate });
        await book.findByIdAndUpdate(bookData._id, { $inc: { numberOfCopies: 1 } });

        res.status(200).json({ 
            msg: "Book returned successfully", 
            data: {
                ...newReturn.toObject(),
                bookTitle: borrowedBook.book.bookTitle,
                author: borrowedBook.book.author,
                dueDate: borrowedBook.dueDate.toISOString().split('T')[0]
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            msg: "Internal Server Error", 
            error: error.message 
        });
    }
});

adminRoute.get('/searchbook', async (req, res) => {
    try {
        const { searchValue } = req.query;
        if (!searchValue) {
            return res.status(400).json({ message: "Query parameter is required" });
        }

        const searchResults = await book.find({
            $or: [
                { bookTitle: { $regex: searchValue, $options: "i" } },
                { bookId: { $regex: searchValue, $options: "i" } },
                { author: { $regex: searchValue, $options: "i" } }
            ]
        });

        if (searchResults.length === 0) {
            return res.status(404).json({ message: "No books found." });
        }

        res.status(200).json(searchResults);
    } catch (error) {
        console.error("Error searching books:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export {adminRoute}

