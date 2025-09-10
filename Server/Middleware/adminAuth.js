const adminCheck=(req,res,next)=>{
    if(req.Role=='Admin'){
        next();
    }
    else{
        res.status(403).json({msg:"You are not allowed"})
    }
}

export default adminCheck;