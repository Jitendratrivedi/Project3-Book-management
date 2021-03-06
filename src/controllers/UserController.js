const userModel=require("../models/UserModel")
const jwt=require("jsonwebtoken")

//const { default: mongoose } = require("mongoose");
const validator=require("../validators/validators")


const createUser= async function(req,res) {
try{
    let data=req.body;


if(!validator.isValidRequestBody(data)){

    return res.status(400).send({status:false,msg:"no user details given"})
}


const {title,name,phone,email,password,address}=data;



if(!validator.isValidTitle(title)){
    return res.status(400).send({status:false,msg:"title is invalid"})
    
}


if(!validator.isValid(name)){

    return res.status(400).send({status:false,msg:"name is not valid"})
}


if(!validator.isValidMobileNumber(phone)){

   return res.status(400).send({status:false,msg:"mobile number is invalid"})
}

if(!validator.isValidEmail(email)){

    return res.status(400).send({status:false,msg:"email is invalid"})
 }


if(!validator.isValidPassword(password)){

    return res.status(400).send({status:false,msg:"password is not valid"})
}



let mobileNumberExists=await userModel.findOne({phone:phone})
if(mobileNumberExists){
   return res.status(400).send({status:false,msg:"phone number already exists"})
}


let emailAlreadyExists=await userModel.findOne({email:email})
if(emailAlreadyExists){
    return res.status(400).send({status:false,msg:"email already used"})
}


let insertedRecord=await userModel.create(data);
res.status(201).send({status:true,msg:"success",data:insertedRecord})

}

catch(err){
    res.status(500).send({status:false,message:err.message})
}


}
const login=async function(req,res){
    try{
        let body=req.body 
        if(!validator.isValidRequestBody(body)){
                return res.status(400).send({status:false,message:"Please provide login details"})
        }        
        
        let {email,password}=req.body
        
        if(!validator.isValid(email)){
            return res.status(400).send({status:false,message:"Email is required"})
    
        }
        
        
        if(!validator.isValid(password)){
            return res.status(400).send({status:false,message:"Password is required"})
    
        }

        if(!validator.isValidEmail(email)){

            return res.status(400).send({status:false,msg:"email is invalid"})
         }
        
        
        if(!validator.isValidPassword(password)){
        
            return res.status(400).send({status:false,msg:"password is not valid"})
        }
    
    
        let data=await userModel.findOne({email:email,password:password})
        if(!data){
            return res.status(400).send({status:false,message:"Invalid login credentials"})
        } 
        else{
            let token=jwt.sign({userId:data._id,batch:"uranium"},"Group-52", {expiresIn:"10h"})
            res.status(200).send({status:true,data:{token:token}})
    
        }
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }

}






module.exports.login=login
module.exports.createUser=createUser;