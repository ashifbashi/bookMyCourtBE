var express = require('express');
const { getAllCourtsData, getSingleCourtData, dayWiseTimeSlot, getMyBookingData, updateUser, userData } = require('../controllers/userController');
const { userAuth } = require('../middlewares/authorization');
var router = express.Router();
const multer = require('multer');


const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/user')
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now()+"-"+file.originalname)
    }
})
const upload = multer({storage:fileStorage})

/* GET users listing. */
router.get('/getAllCourtsData',userAuth, getAllCourtsData)
router.get('/getSingleCourtData',userAuth, getSingleCourtData)
router.get('/dayWiseTimeSlot',userAuth, dayWiseTimeSlot)
router.get('/getMyBookingData',userAuth, getMyBookingData)
router.post('/updateUser',userAuth,upload.single('image'), updateUser)
router.get('/userData',userAuth, userData)


module.exports = router;
