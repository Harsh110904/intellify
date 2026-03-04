const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req,res){
    const{fullname:{firstname, lastname}, email,password}= req.body;

    const isUserAlreadyExists= await userModel.findOne({email})
    if(isUserAlreadyExists){
        res.status(400).json({
            message:"User Already Exists"
        })
    }
    const hashPassword= await bcrypt.hash(password,10)
    const user= await userModel.create({
        fullname:{
            firstname,
            lastname 
        },
        email,
        password: hashPassword
    })
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})

    res.cookie("token", token)
    res.status(201).json({
        message: "User registered successfully",
        user:{
            email: user.email,
            fullname: user.fullname,
            _id: user._id
        }
    })
}

async function loginUser(req,res){
    const{email, password}= req.body
    const user = await userModel.findOne({
        email
    })
    if(!user){
        res.status(400).json({
            message:"Invalid credentials"
        })
    }
    const ispasswordValid= await bcrypt.compare(password, user.password)
    if(!ispasswordValid){
        return res.status(400).json({
            message: "Invalid password"
        })
    }
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET)
    res.cookie("token", token )
    res.status(200).json({
        message:"User logged in successfully",
        user:{
            email: user.email,
            fullname: user.fullname,
            _id:user._id
        }
    })
}

    module.exports={
        registerUser,
        loginUser
    }
