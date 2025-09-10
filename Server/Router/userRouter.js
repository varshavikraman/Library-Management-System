import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {user,book} from "../Models/sample.js";

dotenv.config();

const userRoute = Router();

userRoute.post('/signup',async(req,res)=>{
    try{
        const {Name,UserName,Password,UserRole} = req.body;
        console.log(Name);
    
        const existingUser = await user.findOne({userName : UserName});

    if(existingUser){
        return res.status(400).json("This Username already exists");
    }

    if (UserRole === 'Admin') {
        const adminExists = await user.findOne({ userRole: "Admin" });
        if (adminExists) {
            return res.status(403).json({ message: "An Admin already exists. You can only register as a user." });
        }
    }
    
        const newPassword = await bcrypt.hash(Password,10);
        console.log(newPassword);
            const newUser = new user({
                name:Name,
                userName : UserName,
                password : newPassword,
                userRole : UserRole
        });
        await newUser.save();
        res.status(201).json({ message: "SignUp Successful" });
        console.log(existingUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
});

userRoute.post('/login',async(req,res)=>{
    try{
        const {UserName,Password}=req.body;
        const result = await user.findOne({userName : UserName});
        if(!result){
            res.status(400).send("Enter the valid password")
        }
        else{
            console.log(result.password);
            const valid = await bcrypt.compare(Password,result.password);
            console.log(valid);
            if(valid){
                const token = jwt.sign({_id:result._id,userName:UserName,userRole:result.userRole},process.env.SECRET_KEY,{expiresIn:'1h'});
                console.log(token);
                res.cookie('authToken',token,
                    {
                        httpOnly:true
                });
                res.status(200).json({
                    message:"Logged in successfully",
                    userRole: result.userRole
                });
            }
            else{

                res.status(401).send("Unauthorized access");

            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

userRoute.get('/getBook',async(req,res)=>{
    try{
        const bId = req.query.bookId;
        console.log(bId);

        const bookdetails = await book.findOne({bookId:bId});
        if (bookdetails) {
            const imageBuffer = Buffer.from(bookdetails.image, "base64");
      
            res.status(201).json({data:bookdetails})
                
        }
        else{
            res.status(404).json({msg:"No such event available"});
        }
    }      
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

})

userRoute.get('/logout',(req,res)=>{
    res.clearCookie("authToken");
    res.status(200).json({msg:"logged out successfully"})
})

export {userRoute}