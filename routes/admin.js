const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/admin");
const AdminLogin = require("../models/LoginAdmin");

router.put("/updateTermsAndConditions", adminControllers.updateTermsAndConditions);
router.put("/updatePrivacyPolicy", adminControllers.updatePrivacyPolicy);
router.put("/updateDataProtection", adminControllers.updateDataProtection);
router.put("/updateStatusOfPostedJob/:id", adminControllers.updateStatusOfPostedJob);
router.put("/editCompany/:id", adminControllers.editCompany);
router.put("/editRecruiter/:id", adminControllers.editRecruiter);
router.put("/editManageRoleUser/:id", adminControllers.editManageRoleUser);
router.put("/changeStatusOfUser/:userId", adminControllers.changeStatusOfUser);
router.put("/changeStatusOfManageRole/:userId", adminControllers.changeStatusOfManageRole);
router.post('/sendNotifications', adminControllers.sendNotifications);
router.post("/sendNotificationsById/:clientId", adminControllers.sendNotificationsById);
router.put("/changeStatusOfManageRole/:id", adminControllers.changeStatusOfManageRole);
router.get("/getCompanies", adminControllers.getCompanies);




router.get("/manageRole", async (req, res, next) => {
  try {
    const data = await AdminLogin.find();
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.delete("/manageRole/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    await AdminLogin.findByIdAndDelete(id);
    res.status(200).json({ message: "del" });
  } catch (error) {
    next(error);
  }
});


router.get('/searchadminuser/:key', async (req, res) => {
  try {
    // console.log(req.params.key);
    const share = await AdminLogin.find({
      "$or": [
        { "id": { $regex: req.params.key } },
        { "userName": { $regex: req.params.key } },
        { "email": { $regex: req.params.key } },
      ]
    })
    // console.log(share);
    res.status(200).json(share)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// _____________________________________Admin Deshborad______________________________________________________

const COMPANY = require('../models/company')
const RECRUITER = require('../models/recruiters')
const PostedJobs = require('../models/postJobs');
const USER = require('../models/users')
const { endOfDay, startOfDay } = require('date-fns')
const CandidateProfiles = require("../models/candidateProfiles");


router.get('/adminDeshboradCount', async (req, res) => {

  try {
    const datacompany = await COMPANY.find().countDocuments()
    const datarecruiter = await RECRUITER.find().countDocuments()
    const datatotalApproved = await PostedJobs.find({ status: "Admin-Approve" }).countDocuments()


    const newCompanyJoin = await USER.find({ role: "company", createdAt: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) } }).countDocuments()
    const newrequiterJoin = await USER.find({ role: "recruiter", createdAt: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) } }).countDocuments()
    const newUser = newCompanyJoin + newrequiterJoin

    const todayCompanyJoin = await USER.find({ role: "company", updatedAt: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) } }).countDocuments()
    const todayrequiterJoin = await USER.find({ role: "recruiter", updatedAt: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) } }).countDocuments()
    const shortListed = await CandidateProfiles.find({
      $or: [
        { status: "Internal Shortlist" },
        { status: "Company Shortlist" },
        { status: "Interview Process" },
        { status: "Candidate Selected" },
        { status: "Candidate Joined" },
        { status: "Payment Done" },
      ]
    }).countDocuments()

    const data = await CandidateProfiles.find()
    let count = 0
    const dataf = data.map((value, key) => {
      if (value.resume) {
        count++
      }
    })

    res.status(200).json([datacompany, datarecruiter, datatotalApproved, newCompanyJoin, newrequiterJoin, newUser, todayCompanyJoin, todayrequiterJoin, shortListed, count])
  } catch (error) {
    res.status(500).json(error.message)

  }

})



module.exports = router;
