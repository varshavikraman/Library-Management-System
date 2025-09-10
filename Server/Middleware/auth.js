import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const authenticate = (req,res,next)=>{
    const cookie = req.headers.cookie;
    console.log(cookie);
if(cookie){
    const [name,token] = cookie.trim().split('=')
    console.log(name);
    console.log(token);
    if(name == 'authToken'){
        const verified=jwt.verify(token,process.env.SECRET_KEY)
        console.log(verified)
        req.user_id=verified._id
        req.Name = verified.userName;
        req.Role = verified.userRole;
        next();
    }else{
        res.status(401).send("Unauthorized Access");
    }
}else{
    res.status(401).send("Please SignUp")
}
}
export default authenticate