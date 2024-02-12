const COURT = require('../Models/courtSchema');
const COURT_SCHEDULES=require('../Models/courtSchedules');

const addCourtData =async (req, res) => {
    console.log("hi");
    try {

        await COURT({courtName: req.query.courtName,
            location: req.query.location,
            address: req.query.address,
            type: req.query.type,
            courtPic: req.file.filename}).save().then((response)=>{
            res.status(200).json({ message: "Court registration successfull" })
        })
        
    } catch (error) {
        res.status(500).json({ message: "Court registration filed" })
    }
 
}


const addTimeSlotData =(req,res)=>{

const {startDate, endDate, cost, selectedTiming, courtId}=req.body
let currentDate = new Date(startDate)
const lastDate = new Date(endDate)
// console.log(startDate, endDate, cost, selectedTiming, courtId, "dataaaa")
const slotObjects=[]

while(currentDate<=lastDate){
  
    for(let data of selectedTiming){
        // console.log(currentDate);
       slotObjects.push({
          date:new Date(JSON.parse(JSON.stringify(currentDate))),
          slot:{
              name:data.name,
              id:data.id,
            },
            cost,
            courtId

       })
    }  
    currentDate.setDate(currentDate.getDate()+1)
}

COURT_SCHEDULES.insertMany(slotObjects).then((response)=>{
    res.status(200).json({message:'court time slots created successfully'})
})
.catch((err)=>{
    res.status(401).json(err)
})

// console.log(slotObjects, "slots");
}
 

const updateEditedCD =(req,res)=>{
  console.log(req.body);

  COURT.updateOne({_id:req.body._id}, {$set:{courtName:req.body.courtName, location:req.body.location, type:req.body.type, address:req.body.address}}).then((response)=>{
     res.status(200).json({message:"Court data updated successfully"})
     console.log(response,"rrrrrrrrrr");
  }).catch((err)=>{
      console.log(err);
  })
}


module.exports = { addCourtData, addTimeSlotData, updateEditedCD }