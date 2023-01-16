const router = require("express").Router();
const CareerQurey = require('../models/Career_qurey')
const ContactQurey = require('../models/Contact_qurey')
const InvestQurey = require('../models/Invest_qurey')
const validatePhoneNumber = require('validate-phone-number-node-js');
const { validationResult } = require('express-validator');
const multer = require('multer')

// for file uploding
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uplode')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const uplode = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }
})


// **********************************************************************************



// router.get('/searchInvestQurey/:key', async (req, res) => {
//   try {
//     const share = await InvestQurey.find({
//       "$or": [
//         // { "id": { $regex: req.params.key } },
//         { "fullName": { $regex: req.params.key } },
//         { "email": { $regex: req.params.key } },
//         { "phoneNumber": { $regex: req.params.key } },
//         { "company": { $regex: req.params.key } }
//       ]

//     })
//     // console.log(share);
//     res.status(200).json(share)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })




router.get('/searchInvestQurey/:key', async (req, res) => {
  try {
    // console.log(req.params.key);
    const share = await InvestQurey.find({
      "$or": [
        // { "id": { $regex: req.params.key } },
        { "fullName": { $regex: req.params.key } },
        { "email": { $regex: req.params.key } },
        { "company": { $regex: req.params.key } },
        // { "phoneNumber": { $regex: req.params.key } },
      ]
    })
    // console.log(share);
    res.status(200).json(share)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


router.get('/searchContactQurey/:key', async (req, res) => {
  try {
    // console.log(req.params.key);
    const share = await ContactQurey.find({
      "$or": [
        // { "id": { $regex: req.params.key } },
        { "name": { $regex: req.params.key } },
        { "email": { $regex: req.params.key } },
        // { "phoneNumber": { $regex: req.params.key } }
      ]
    })
    // console.log(share);
    res.status(200).json(share)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})







// //////////////////////////////////////////////////////////////////////////////

// api for find CareerQurey

router.get('/careerQurey', async (req, res) => {
  try {
    const careerQureyData = await CareerQurey.find()
    res.status(200).json(careerQureyData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})
router.get('/careerQureyRusume/:id', async (req, res) => {

  const id = req.params.id
  try {
    const careerQureyData = await CareerQurey.findById(id)
    res.status(200).json(careerQureyData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})



//api for find contactQurey
router.get('/contactQurey', async (req, res) => {
  try {
    const contactQureyData = await ContactQurey.find()
    res.status(200).json(contactQureyData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// api for mail
router.get('/contactQureyMail/:id', async (req, res) => {

  const id = req.params.id
  try {
    const contactQureyMail = await ContactQurey.findById(id)
    res.status(200).json(contactQureyMail)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// api for delete


router.get('/contactQureydel/:id', async (req, res) => {

  const id = req.params.id
  try {
    const contactQureyMail = await ContactQurey.findByIdAndDelete(id)
    res.status(200).json({ message: 'del' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})





// api for find InvestQurey

router.get('/InvestQurey', async (req, res) => {
  try {
    const InvestQureyData = await InvestQurey.find()
    res.status(200).json(InvestQureyData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})



router.put('/InvestQureyStatus/:id', async (req, res) => {
  const id = req.params.id
  const { status } = req.body

  try {
    const InvestQureyData = await InvestQurey.findByIdAndUpdate(id, { status }, { new: true })
    res.status(200).json(InvestQureyData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})




router.put('/contentQureyStatus/:id', async (req, res) => {
  const id = req.params.id
  const { status } = req.body

  try {
    const ContactQureyd = await ContactQurey.findByIdAndUpdate(id, { status }, { new: true })
    res.status(200).json(ContactQureyd)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})





router.post('/InvestQureyFilter', async (req, res) => {
  const { status } = req.body

  try {
    const InvestQureyData = await InvestQurey.find({ status })
    res.status(200).json(InvestQureyData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


router.post('/contactQureyFilter', async (req, res) => {
  const { status } = req.body

  try {
    const InvestQureyData = await ContactQurey.find({ status })
    res.status(200).json(InvestQureyData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// *********************************************************************************

router.post('/InvestQurey', async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { fullName, email, phoneNumber, company, message } = req.body;

    const result = await validatePhoneNumber.validate(phoneNumber);
    if (!result) {
      const error = new Error("Invalid Phone number.");
      throw error
    }
    const Data = new InvestQurey({
      fullName,
      email,
      phoneNumber,
      company,
      message,
      status: 'Unread'
    });
    const saveData = await Data.save();
    res.status(201).json(saveData);

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }

})



router.post('/contactQurey', async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { name, email, message } = req.body;
    const Data = new ContactQurey({
      name,
      email,
      message,
      status: "Unread"
    });
    const saveData = await Data.save();
    res.status(201).json(saveData);

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }

})




router.post('/careerQurey', uplode.single('resume'), async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    if (req.file) {
      const { position, jobtype, experience, location } = req.body;
      const Data = new CareerQurey({
        position,
        jobtype,
        experience,
        location,
        resume: req.file.filename
      });
      const saveData = await Data.save();
      res.status(201).json(saveData);
    } else {

      const { position, jobtype, experience, location } = req.body;
      const Data = new CareerQurey({
        position,
        jobtype,
        experience,
        location
      });
      const saveData = await Data.save();
      res.status(201).json(saveData);
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }

})


// ****************************************************************************************************
// --------------------------------feature sections---------------------------------------


const FEATURES = require('../models/Feature')

router.post('/feature/:id', async (req, res) => {
  const { text, type } = req.body
  const { id } = req.params
  console.log(id);
  console.log(req.body);
  try {
    const data = new FEATURES({ message: text, ApplicationFrom: id, type, status: "Unread" })
    const data1 = await data.save()
    res.status(201).json(data1)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/featureReq', async (req, res) => {

  try {
    const data = await FEATURES.find({ type: "Recruiter" }).populate({ path: "ApplicationFrom" }).exec()
    res.status(500).json(data)


  } catch (error) {
    res.status(500).json({ message: error.message })

  }


})
router.get('/featureCompany', async (req, res) => {

  try {
    const data = await FEATURES.find({ type: "company" }).populate({ path: "ApplicationFrom" }).exec()
    res.status(500).json(data)


  } catch (error) {
    res.status(500).json({ message: error.message })

  }


})

router.put('/feature/:id', async (req, res) => {
  const id = req.params.id
  try {
    const ContactQureyd = await FEATURES.findByIdAndUpdate(id, { status: "Read" }, { new: true })
    res.status(200).json(ContactQureyd)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// ------------------------------------------------------------------------------------------------




module.exports = router;
