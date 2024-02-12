var express = require('express');
const { orders,paymentSuccess } = require('../controllers/paymentController');
const { userAuth } = require('../middlewares/authorization');
var router = express.Router();

router.post('/orders',userAuth, orders)
router.post('/success',userAuth, paymentSuccess)


module.exports=router