const express = require('express');
const router = express.Router();
const usersControllers = require('../controllers/users');

router.get('/getTermsAndConditions', usersControllers.getTermsAndConditions);
router.get('/getPrivacyPolicy', usersControllers.getPrivacyPolicy);
router.get('/getDataProtection', usersControllers.getDataProtection);
router.get('/getCandidatesProfile',usersControllers.getCandidatesProfile);
router.get('/getRecruiters',usersControllers.getRecruiters);
router.get('/getCompanies',usersControllers.getCompanies );
router.get('/getUserById/:id',usersControllers.getUserById);
router.put('/changeUserPassword/:id',usersControllers.changeUserPassword);
router.get('/getImage/:filename',usersControllers.getImage);
router.put('/updateClientNotificationReg_Id/:id',usersControllers.updateClientNotificationReg_Id);
router.put('/saveNotification/:id',usersControllers.saveNotification);
router.get('/getNotificationByuserId/:id',usersControllers.getNotificationByuserId);
router.put('/updateSeenNotification/:id',usersControllers.updateSeenNotification);
router.delete('/deleteNotification/:id', usersControllers.deleteNotification);
router.put('/storeClientNotificationReg_Id/:id', usersControllers.storeClientNotificationReg_Id);




// ---------------------------------------------------
const CandidatesProfile = require("../models/candidateProfiles");


router.get('/manageJobssearchbar/:key', async (req, res) => {
    try {
    //   console.log(req.params.key);
      const result = await CandidatesProfile.find({
  
  
        "$or": [
          // { "id": { $regex: req.params.key } },
          { "status": { $regex: req.params.key } },
          { "name": { $regex: req.params.key } },
        //   { "jobId.jobType": { $regex: req.params.key } },
        ]
  
      }).sort({ createdAt: -1 }) .populate([
        { path: "recruiterId" },
        { path: "jobId", populate: { path: "companyId", model: "companies" } },
      ])
    //   .find({
  
  
    //     "$or": [
    //       // { "id": { $regex: req.params.key } },
    //       { "status": { $regex: req.params.key } },
    //       { "jobId.jobType": { $regex: req.params.key } },
    //       { "jobId.skills": { $regex: req.params.key } },
    //     ]
  
    //   })
      .exec()
      res.status(200).json({ message: 'Open positions successfully fetched.', posts: result })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })





module.exports = router;