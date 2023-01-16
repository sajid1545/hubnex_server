const router = require("express").Router();
const Banner = require('../models/Banner')
const Users = require('../models/users')
const Policy =require('../models/privacyPolicy')
const multer = require('multer')

// for file uploding
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uplode')},
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }})

const uplode = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }
})


// **********************************************************************************


// for find api banner
router.get('/banner', async (req, res) => {
  try {
    const bannerData = await Banner.findOne()
    res.status(200).json(bannerData)
} catch (error) {
    res.status(500).json({ message: error.message })
}
})

// update api banner
router.put('/banner/:id', uplode.single('img'), async (req, res) => {
    const { title, desc, longDesc } = req.body
    const id  =req.params.id
    try {
    if (req.file) {
        let bannerD = await Banner.findByIdAndUpdate(id,{ title, desc, longDesc, img: req.file.filename},{new:true})
        res.status(200).json(bannerD)
         
    } else {
        let bannerD = await Banner.findByIdAndUpdate(id,{ title, desc, longDesc},{new:true})
        res.status(200).json(bannerD)
         }
   } catch (error) {
    res.status(404).json({ message: error.message })
}
})

// **************************************************************************************

// api for login details



  //company login



// *********************************************************************************


//requ status change

router.put('/users/:id', async (req, res) => {
   const id = req.params.id
   const {status} = req.body
   console.log(req.body);
  try {
      const userData = await Users.findByIdAndUpdate(id,{status})
      res.status(200).json(userData)
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
  })

//company status change


router.put('/usersCompany/:id', async (req, res) => {
   const id = req.params.id
   const {status} = req.body
   console.log(req.body);
  try {
      const userData = await Users.findByIdAndUpdate(id,{status})
      res.status(200).json(userData)
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
  })

// ************************************************************************************

// for find api {Policy}
router.get('/policy', async (req, res) => {
  try {
    const policyData = await Policy.findOne()
    res.status(200).json(policyData)
} catch (error) {
    res.status(500).json({ message: error.message })
}
})

// update api {Policy}
router.put('/policy/:id', async (req, res) => {
    const { policy } = req.body
    const id  =req.params.id
    try {
    
        let policyData = await Policy.findByIdAndUpdate(id,{ policy},{new:true})
        res.status(200).json(policyData)
         
   } catch (error) {
    res.status(404).json({ message: error.message })
}
})

















module.exports = router;
