const mongoose = require('mongoose');
//importing the car model which have car details
const Car = require('../models/car');
const cloudinary = require('cloudinary').v2
require('../handlers/cloudinary')


//Anyone can the all cars which are updated on the website
exports.all_cars = (req,res,next)=>{
    Car.find().select("_id brand model price drivenKM carImage").exec().then(docs =>{
        console.log(docs);
        res.status(200).json(docs);
    }).catch(err => {
        console.log(err);
        res.status(500).json({error:err})
    });
}

//any user wants to search for car without logging
exports.search_by_brand = (req,res,next) => {
   
   
    try {
        const category = req.params.category
        Car.find({brand:category}).exec().then(response => { 
                res.status(200).json(response);
        }).catch(err=> {
            console.log(err);
            res.status(500).json({error:err});
        });
    } catch (err) {
        console.log(err);
        if (err.name === "ValidationError")
            return res.status(400).send(`Validation Error: ${err.message}`);
        res.send(err.message);
    }
}


//these routes need authtication of user
exports.sell_car = (req,res,next)=>{
    console.log(req.file);
   cloudinary.uploader.upload(req.file.path).then((result) => {
   console.log(result)
   
   const car = new Car ({
    _id : new mongoose.Types.ObjectId(),
    brand :req.body.brand,
    model:req.body.model,
    year:req.body.year,
    fuel:req.body.fuel,
    drivenKM:req.body.drivenKM,
    price:req.body.price,
    additionINFO:req.body.additionINFO,
    sellerPhoneNo :req.body.sellerPhoneNo,
    carImage:result.url
}); 
car
.save()
.then(response => {
    console.log(response);
        res.status(201).json({ 
            message:"car details added in the Database",
            createdCar :response
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
  }).catch((error) => {
    response.status(500).send({
      message: "failure",
      error,
    });
  });

}

exports.get_a_car = (req,res,next) => {
    const id = req.params.carId;
    //here i use exec() function for search among all
    Car.findById(id).exec().then(doc => {
        console.log("This car we are fething from our database",doc);
        if(doc){
            res.status(200).json(doc);
        } else {
            res.status(404).json({message:"No Car Found of this Id"});
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error:err})
    });
}

exports.update_car = (req,res,next) => {
    const id = req.params.carId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propertyName] =ops.value;
    }
    Car.update({_id : id },{$set : updateOps}).exec().then(response => {
        console.log("Car Deatails Updated Scucesfully");
        res.status(200).json(response);
    }).catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
}




exports.delete_car = (req,res,next) => {
    const id = req.params.carId;
    Car.remove({ _id: id }).exec().then(response => {
        console.log("car deleted from database")
        res.status(200).json(response);
    }).catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
  
}
