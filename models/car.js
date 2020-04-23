const mongoose = require('mongoose')

const carSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    brand :{ type: String,required:true},
    model:{type: String, required: true},
    year:{type: Number, required: true},
    fuel:{type: String, required: true},
    drivenKM:{type: Number, default: 0},
    price:{type: Number, required: true},
    additionINFO:{type: String},
    sellerPhoneNo:{type:Number,required:true},
    carImage:{type:String, required: true}
});

module.exports = mongoose.model('Car',carSchema);