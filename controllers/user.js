const mongoose = require('mongoose');
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


//const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config();

const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    debug:process.env.NODE_ENV==='development',
    auth:{
        user:process.env.GMAIL_EMAIL,
        pass:process.env.PASS
    },
    tls: {
      rejectUnauthorized: false
    }
})          


exports.register_user = (req,res) => {
    //make sure that user not exist already in database
    User.find({email:req.body.email}).exec().then(user => {
        if(user.length >= 1){
            return res.status(409).json({message:"user already exist can't register"});
        } else {
            bcrypt.hash(req.body.password,10,(err,hash) => {
                if(err) {
                    return res.status(500).json({error:err});
                } else {
                   //send confirmation mail
                   const token = jwt.sign({user:req.body.email},process.env.JWT_KEY,{expiresIn:"24h"})
                    const url = `http://localhost:8080/user/confirmation/${token}`;
                    const mailOption ={
                        from:'prakashjayaswal62@gmail.com',
                        to:req.body.email,
                        subject:'Verify your email',
                        text:"your account created on carmarket",
                        html:  `hi "${req.body.email}" Please click link to confirm your email: <a href="${url}">${url}</a>`                   
                     }
                    
                    let newUser = new User({
                        name:req.body.name,
                        email:req.body.email,
                        password: hash,
                        contactNo:req.body.contactNo
                    });
                   
                    newUser.save().then(response => {
                        console.log(response);
                        transporter.sendMail(mailOption,(error,info) => {
                            if(error){
                                console.log(error)
                            }else{
                                res.status(201).json({message:"verification link sent to Your email address",User:response})
                                }
                               })
                        }).catch(err => {
                            console.log(err);
                            res.status(500).json({error:err});
                        });   
                }
            })
        }
    }).catch();   
}

exports.confirmation = (req,res,next) => {
    try {
        const confirmToken = req.params.token
        const { user } = jwt.verify(confirmToken, process.env.JWT_KEY);
        console.log(user);
        User.findOneAndUpdate({email:user},{isConfirmed:true}, {new: true}, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            return res.status(200).json({message:"email verification Successfull now u can access your account "})  
        })
  
      } catch (e) {
        console.log(e.message);
        return res.status(400).send("Email confirmation issue");
      }
      
}

exports.login_user = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    
    User.find({email:email}).exec().then(user => {
        if(user.length < 1){
            return res.status(401).json({message:"User Doesn't Exist"});
        }
        bcrypt.compare(password, user[0].password,(err,isMatch) => {
            if(err) {
               return res.status(401).json({message:"Authentication Failed"});
            } 
            //check email verified or not
            if(!user[0].isConfirmed){ 
                return res.status(401).json({message:"You need to verify email"});
            }
            
            //if password are matched
            if(isMatch){
                const token = jwt.sign({email: user[0].email, userId: user[0]._id},process.env.secretKey,{expiresIn:500000});
                return res.status(200).json({message:"Authentication successful",Token : token,Id: user[0]._id })
            }
            //if the accound is beign verified
           
            res.status(401).json({message:"Authentication Failed"});
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
}

exports.logout_user = (req,res,next) => {
    try{
        //check if user is logined
        if(req.session.userId){
          //delete the session
          req.session.destroy();
          //send success response
          res.json({ logout_successfull: true });
        }else{
          //send error response if user is not logined
          res.status(401).json({ Error: "login first"})
        }
      }
      catch(err){
        console.log(err.message);
        //send server error response if any
        res.json({ Error: "server error"})
      }
}

exports.change_Password = (req,res,next) => {
    let { email, oldPassword, newPassword } = req.body;
        if (!email || !oldPassword || !newPassword)
          return res.status(400).send("Bad request");
        try {
          //console.log(email,oldPassword,newPassword) just for checck
          
         bcrypt.hash(newPassword,10,(err,hash) => {
            if(err) {
          return res.status(500).json({error:err});
          } else {
            User.findOneAndUpdate({email:email},{password:hash}, {new: true}, (err, doc) => {
                if (err) {
                    console.log("Something wrong when updating data!");
                }
                return res.status(200).json({message:"login password has been updated "})  
                })
           }
          });
    }
         catch (err) {
          console.log(err.message);
          res.send("incorrect credentials");
    }
}


exports.profile = (req,res,next) => {
    User.find({_id:req.params.userId}).exec().then(response => {
        res.status(200).json(response);
    }).catch(err=> {
        console.log(err);
        res.status(500).json({error:err});
    })
}

exports.delete_user = (req,res,next) => {
    User.deleteOne({_id: req.params.userId}).exec().then(response => {
        res.status(200).json({message:"User Deleted Succesfully"})
    }).catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
}