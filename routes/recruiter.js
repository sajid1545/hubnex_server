const express = require("express");
const router = express.Router();
const recruiterControllers = require("../controllers/recruiter");
const upload = require("../middlewares/upload");
const fetch = require("node-fetch");

router.get("/getOpenPositions", recruiterControllers.getOpenPositions);
router.put("/claimPosition/:jobId/:userId", recruiterControllers.claimPosition);
router.get(
  "/getClaimedPositions/:userId",
  recruiterControllers.getClaimedPositions
);
router.post(
  "/addCandidate/:jobId/:recruiterId",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "additionalFiles", maxCount: 5 },
  ]),
  recruiterControllers.addCandidate
);
router.put(
  "/settingsRecruiter/:id",
  upload.single("profilePhoto"),
  recruiterControllers.settingsRecruiter
);

// =======================================================================================================

const ManageCandidate = require("../models/candidateProfiles");

router.get("/reqcritorApprove", async (req, res, next) => {
  try {
    const result = await ManageCandidate.find({ status: "Submitted" })
      .populate([
        { path: "recruiterId" },
        { path: "jobId", populate: { path: "companyId", model: "companies" } },
      ])
      .exec();
    if (!result) {
      const error = new Error("No Candiates founds");
      error.statusCode = 404;
      throw error;
    }
    console.log(result);
    res
      .status(200)
      .json({
        message: "Candidates profile successfully fetched.",
        posts: result,
      });
  } catch (error) {
    next(error);
  }
});
// router.get("/reqcritorApprove", async (req, res) => {
//   try {
//     const data = await ManageCandidate.find({ status: "Submitted" });
//     console.log(data.jobId);
//     res.status(200).json(data);
//     // console.log(data);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// aaprrov by admin api
router.put("/ManageProfileStatusChange/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  // console.log(req.body);
  try {
    const { statusDb } = req.body;
    const data = await ManageCandidate.findByIdAndUpdate(
      id,
      { status: statusDb },
      { new: true }
    );
    const result = await ManageCandidate.findById(id)
      .populate(["recruiterId", "jobId"])
      .exec();
    if (!result) {
      throw new Error("Something went wrong.");
    }
    const notificationTitle = statusDb;
    const notificationBody = `The status of candidate profile is ${statusDb} for jobId: ${id} after admin acknowledgment`;
    await fetch(
      `http://localhost:5000/admin/sendNotificationById/${result.recruiterId}`,
      {
        method: "post",
        body: JSON.stringify({
          notificationTitle: notificationTitle,
          notificationBody: notificationBody,
          clientType: "Admin",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (statusDb === "Internal Shortlist") {
      const notificationTitle = `Internal Shortlist`;
      const notificationBody = `A new candidate has been approved by admin for jobId: ${id} .`;
      await fetch(
        `http://localhost:5000/admin/sendNotificationBiId/${result.jobId.companyId}`,
        {
          method: "post",
          body: JSON.stringify({
            notificationTitle: notificationTitle,
            notificationBody: notificationBody,
            clientType: "Admin",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    res.status(200).json(data);
    // console.log(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -----------------------------------------------------------------

const Needhelprecruiter = require("../models/Needhelprecruiter");

router.post("/needHelpRecruiter", async (req, res) => {
  const { email, recruiterId, recruiterName, message } = req.body;
  try {
    const data = new Needhelprecruiter({
      email,
      recruiterId,
      message,
      recruiterName,
      status: "Unread",
    });
    const share = await data.save();
    res.status(200).json(share);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/needHelpRecruiter", async (req, res) => {
  try {
    const data = await Needhelprecruiter.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/needHelpRecruiter/:id", async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  try {
    const needHelpRecruiter = await Needhelprecruiter.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.status(200).json(needHelpRecruiter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/searchNeedhelprecruiter/:key", async (req, res) => {
  try {
    // console.log(req.params.key);
    const share = await Needhelprecruiter.find({
      $or: [
        // { "id": { $regex: req.params.key } },
        { recruiterId: { $regex: req.params.key } },
        { recruiterName: { $regex: req.params.key } },
        { email: { $regex: req.params.key } },
      ],
    });
    // console.log(share);
    res.status(200).json(share);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/recruiterFilter", async (req, res) => {
  const { status } = req.body;

  try {
    const InvestQureyData = await Needhelprecruiter.find({ status });
    res.status(200).json(InvestQureyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =****************************************************************************
const Users = require("../models/users");

router.get("/searchrecruiter/:key", async (req, res) => {
  try {
    const share = await Users.find({
      $or: [
        { id: { $regex: req.params.key } },
        { fullName: { $regex: req.params.key } },
        { email: { $regex: req.params.key } },
        { phoneNumber: { $regex: req.params.key } },
      ],
    });
    res.status(200).json(share);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// .................................requritor deshborad.........................
const POSTJOB = require("../models/postJobs");
const ClaimedPositions = require("../models/claimedPositions");

const CANDIDATE_PROFILE = require("../models/candidateProfiles");

router.get("/openJobssearchbar/:key", async (req, res) => {
  try {
    // console.log(req.params.key);
    const result = await POSTJOB.find({
      $or: [
        // { "id": { $regex: req.params.key } },
        { jobTitle: { $regex: req.params.key } },
        { jobType: { $regex: req.params.key } },
        { skills: { $regex: req.params.key } },
      ],
    })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "companyId",
          populate: { path: "companyLogo", model: "documents.files" },
        },
        { path: "jobDetailsFile" },
      ])
      .exec();
    // console.log(share);
    res
      .status(200)
      .json({ message: "Open positions successfully fetched.", posts: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.get('/Claimpositionsearchbar/:key/:userId', async (req, res) => {
//   const userId = req.params.userId;
//   console.log(req.params.key);
//   try {
//     const result = await ClaimedPositions.find({ recruiterId: userId })
//     .sort({ createdAt: -1 })
//     .populate([{ path: "recruiterId" },
//     {
//       path: "jobId",
//       populate: {
//         path: "companyId",
//         model: "companies",
//         populate: { path: "companyLogo", model: "documents.files" },
//       },
//     },
//     ])

//       .find({

//         "$or": [
//           // { "id": { $regex: req.params.key } },
//           { "jobTitle": { $regex: req.params.key } },
//           { "jobType": { $regex: req.params.key } },
//           { "skills": { $regex: req.params.key } },
//           // { "createdAt": { $regex: req.params.key } },
//         ]

//       }).exec()

//     console.log(result);
//     res.status(200).json({ message: "Claimed positions successfully found.", posts: result });

//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

// Admin-Approve
//_______________________________________Deshborad recruiter_______________________________________________

const PostedJobs = require("../models/postJobs");
const CandidateProfiles = require("../models/candidateProfiles");
// const ClaimedPositions = require('../models/claimedPositions');
const RECRUITER = require("../models/recruiters");

router.get("/recruitordetails/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const dataIT = await PostedJobs.find({ status: "Admin-Approve", }).countDocuments({ Tech: "IT" });
    const dataNON_IT = await PostedJobs.find({ status: "Admin-Approve", }).countDocuments({ Tech: "non-IT" });

    const dataClamed_PositionData = await RECRUITER.findById(id);
    const dataClamed_Position = (dataClamed_PositionData.claimedJobId).length;


    const datacandidateData = await RECRUITER.findById(id);
    const datacandidate = (datacandidateData.candidatesId).length;


    res.status(200).json([dataIT, dataNON_IT, dataClamed_Position, datacandidate]);
  } catch (error) {
    res.status(500).json(error);
  }
});

//_________________________________________________________________________________________________________

// ================================================================================================================
module.exports = router;
