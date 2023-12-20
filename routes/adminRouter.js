var express = require('express');
const { addCourtData, addTimeSlotData, updateEditedCD } = require('../controllers/adminController');
var router = express.Router();
const multer = require('multer');
const { adminAuth } = require('../middlewares/authorization');


const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/courts')
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now()+"-"+file.originalname)
    }
})
const upload = multer({storage:fileStorage})

router.post('/addCourtData',adminAuth, upload.single('image'), addCourtData)
router.post('/addTimeSlotData',adminAuth, addTimeSlotData)
router.post('/updateEditedCD',adminAuth, updateEditedCD)

 
module.exports = router;