const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    car :{type :mongoose.Schema.Types.ObjectId, ref:'Car',required:true}
});

module.exports = mongoose.model('Order',orderSchema);