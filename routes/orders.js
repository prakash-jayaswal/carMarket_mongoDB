const express= require('express');
const router = express.Router();
const OrderControllers = require('../controllers/orders');
const auth = require('../middleware/auth')


router.get('/',auth,OrderControllers.all_orders);

router.post('/',auth,OrderControllers.create_order);

router.get('/:orderId',auth,OrderControllers.get_order);

router.delete('/:orderId',auth,OrderControllers.delete_order);


module.exports = router;