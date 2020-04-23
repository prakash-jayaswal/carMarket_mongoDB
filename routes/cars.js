const express= require('express');
const router = express.Router();
const multer = require('multer');   
const CarsController = require('../controllers/cars')
const auth = require('../middleware/auth');

//for image uploading
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads/')
    },
    filename: function(req,file,cb){
        cb(null,Date.now() + file.originalname)
    }
})

//make sure file Type of image
const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    } else{
        cb(null,false);
    }
};

//functionaly apply on the upload
const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});  


//This route is used for show all the cars from databse
router.get('/',CarsController.all_cars);

//if user want to searh any car with its brancdNAME
router.get('/search/:category',CarsController.search_by_brand)
router.post('/search/:category',CarsController.search_by_brand)


//In this Route we can upload car with its details
router.post('/sell',auth,upload.single('carImage'),CarsController.sell_car);

//If we want to access any perticular car
router.get('/:carId',CarsController.get_a_car);

//If u want to update car details then make sure u have to pass the data in the array format 
//JUST LIKE THIS [{"propertyName":"NEWDATA","value":"NEWDATA"}]
router.patch('/:carId',auth,CarsController.update_car);

//If we want to delete any car from DB then we will do it via carID
router.delete('/:carId',auth,CarsController.delete_car);



module.exports = router;