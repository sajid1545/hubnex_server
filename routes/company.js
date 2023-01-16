const express = require("express");
const router = express.Router();
const companyControllers = require("../controllers/company");
const upload = require("../middlewares/upload");
const fetch = require("node-fetch");

router.put(
  "/postJob/:id",
  upload.single("jobDetailsFile"),
  companyControllers.postJob
);
router.put(
  "/settingsCompany/:id",
  upload.single("logo"),
  companyControllers.settingsCompany
);
router.get("/getCompanyById/:id", companyControllers.getCompanyById);

// ==================================================================================================

const Company_AddJobs = require("../models/postJobs");
const users_company = require("../models/users");

// company penal pendding....
router.get("/companyPending", async (req, res) => {
  try {
    const share = await Company_AddJobs.find({
      status: "company_addJobs_fress",
    })
      .sort({ createdAt: -1 })
      .populate("jobDetailsFile")
      .exec();
    res.status(200).json(share);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// company page reject....
router.get("/companyRejected", async (req, res) => {
  try {
    const share = await Company_AddJobs.find({ status: "Admin-Rejected" })
      .sort({ updatedAt: -1 })
      .populate("jobDetailsFile")
      .exec();
    res.status(200).json(share);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// company data
router.get("/companyData", async (req, res) => {
  try {
    const companyData = await users_company.find({ role: "company" });
    res.status(200).json(companyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const Documents = require("../models/documents.files");

router.put(
  "/postJobUpdate/:id",
  upload.single("jobDetailsFile"),
  async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const {
      skills,
      jobTitle,
      jobType,
      experience,
      package,
      earnPerClosure,
      noticePeriod,
      location,
      communication,
      qualifications,
      status,
      rewardType,
      responsibilities,
      benefits,
      Tech,
      Currency,
      format,
    } = req.body;
    console.log(req.body.jobTitle);
    try {
      const data = await Company_AddJobs.findByIdAndUpdate(
        id,
        {
          skills,
          jobTitle,
          jobType,
          experience,
          package,
          earnPerClosure,
          noticePeriod,
          location,
          communication,
          qualifications,
          status,
          rewardType,
          responsibilities,
          benefits,
          Tech,
          Currency,
          format,
        },
        { new: true }
      );
      res.status(201).json(data);
      // console.log(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.get("/companyData/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const companyData = await users_company.findById(id);
    res.status(200).json(companyData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

// company jobs data by id
router.get("/companyJobData/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const companyJobData = await Company_AddJobs.find({
      $and: [{ id }, { status: "company_addJobs_fress" }],
    });
    res.status(200).json(companyJobData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// aaprrov by admin api
router.put("/AdminStatusChange/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  // console.log(req.body);
  try {
    const { statusDb, remark } = req.body;
    const data = await Company_AddJobs.findByIdAndUpdate(
      id,
      { status: statusDb, remark },
      { new: true }
    );

    res.status(200).json(data);
    // console.log(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 0000000000000000000000000000000000000000000000000000000000000000000
const ManageCandidate = require("../models/candidateProfiles");

router.get("/companyLiveJobs", async (req, res, next) => {
  try {
    const result = await ManageCandidate.find({
      $or: [
        { status: "Internal Shortlist" },
        { status: "Company Shortlist" },
        { status: "Interview Process" },
        { status: "Candidate Selected" },
        { status: "Candidate Joined" },
        { status: "Payment Done" },
      ],
    })
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
    res.status(200).json({
      message: "Candidates profile successfully fetched.",
      posts: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/liveJobByFilter", async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  console.log(id);
  // console.log(jobType);
  try {
    const share = await ManageCandidate.findById(id);
    // const share = await ManageCandidate.findById({"$and": [{ id }, {
    // console.log(share);

    // const share = await FOrmR.find({jobType})
    res.status(200).json(share);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/finalData/:id", async (req, res) => {
  const id = req.params.id;
  const companyId = id;
  const { jobType } = req.body;
  // console.log(jobType);
  // console.log(req.body);
  try {
    const share = await ManageCandidate.findOne();
    // console.log(share);
    res.status(200).json(share);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
});

router.get("/postJobs", async (req, res) => {
  try {
    const share = await ManageCandidate.find({
      $and: [
        {
          $or: [
            { status: "Internal Shortlist" },
            { status: "Company Shortlist" },
            { status: "Interview Process" },
            { status: "Candidate Selected" },
            { status: "Candidate Joined" },
            { status: "Payment Done" },
          ],
        },
      ],
    })
      .populate([
        { path: "recruiterId" },
        { path: "jobId", populate: { path: "companyId", model: "companies" } },
      ])
      .exec();
    //         let a = []
    for (let x of share) {
      a.push(x.jobId.jobTitle);
    }
    let uniqueChars = [...new Set(a)];
    res.status(200).json(uniqueChars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/postJobscheckNumber", async (req, res) => {
  try {
    const share = await ManageCandidate.find({
      $and: [
        {
          $or: [
            { status: "Internal Shortlist" },
            { status: "Company Shortlist" },
            { status: "Interview Process" },
            { status: "Candidate Selected" },
            { status: "Candidate Joined" },
            { status: "Payment Done" },
          ],
        },
      ],
    })
      .populate([
        { path: "recruiterId" },
        { path: "jobId", populate: { path: "companyId", model: "companies" } },
      ])
      .exec();
    let a = [];
    for (let x of share) {
      a.push(x.jobId.jobTitle);
    }

    const counts = {};

    a.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });

    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =======================================================================
const NEED = require("../models/Needhelpcompany");

router.post("/needHelpCompany", async (req, res) => {
  const { email, company, message } = req.body;
  try {
    const data = new NEED({ email, company, message, status: "Unread" });
    const share = await data.save();
    res.status(200).json(share);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/needHelpCompany", async (req, res) => {
  try {
    const data = await NEED.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/needHelpCompany/:id", async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  try {
    const needHelpCompany = await NEED.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.status(200).json(needHelpCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/companyFilter", async (req, res) => {
  const { status } = req.body;

  try {
    const InvestQureyData = await NEED.find({ status });
    res.status(200).json(InvestQureyData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/searchNeedhelpcompany/:key", async (req, res) => {
  try {
    // console.log(req.params.key);
    const share = await NEED.find({
      $or: [
        // { "id": { $regex: req.params.key } },
        { company: { $regex: req.params.key } },
        { email: { $regex: req.params.key } },
      ],
    });
    // console.log(share);
    res.status(200).json(share);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================================================================================================

const Users = require("../models/users");

router.get("/searchcompany/:key", async (req, res) => {
  try {
    const share = await Users.find({
      $or: [
        { id: { $regex: req.params.key } },
        { companyName: { $regex: req.params.key } },
        { email: { $regex: req.params.key } },
        { phoneNumber: { $regex: req.params.key } },
        // {"companyId.companyWebsite" :{$regex :req.params.key}}
      ],
    });
    res.status(200).json(share);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ******************************************************

// -+++++++++++++++++++++++++++++++++++++++++++++ company deshborad +++++++++++++++++++++++++++++++++++++++++++
const POSTJOB = require("../models/postJobs");

router.get("/pendingApprovesearchbar/:key", async (req, res) => {
  try {
    console.log(req.params.key);
    const share = await POSTJOB.find({
      $or: [
        // { "id": { $regex: req.params.key } },
        { jobTitle: { $regex: req.params.key } },
        { jobType: { $regex: req.params.key } },
      ],
    }).find({ status: "company_addJobs_fress" });
    // console.log(share);
    res.status(200).json(share);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/rejectedsearchbar/:key", async (req, res) => {
  try {
    console.log(req.params.key);
    const share = await POSTJOB.find({
      $or: [
        // { "id": { $regex: req.params.key } },
        { jobTitle: { $regex: req.params.key } },
        { jobType: { $regex: req.params.key } },
      ],
    }).find({ status: "Admin-Rejected" });
    // console.log(share);
    res.status(200).json(share);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// -+++++++++++++++++++++++++++++++++++++++++++++++admin applications+++++++++++++++++++++++++++++++++++++++++
const companyData = require("../models/company");

router.get("/adminCompanyApllicationSearchbar/:key", async (req, res) => {
  // console.log(req.params.key);
  try {
    const result = await companyData.find({
      $or: [
        //   { "id": { $regex: req.params.key } },
          { "companyName": { $regex: req.params.key } },
      ],
    })

        .populate([
            {
                path: "jobPostedId",
                populate: [
                    { path: "jobDetailsFile", model: "documents.files" },
                    {
                        path: "candidatesId",
                        model: "candidateprofiles",
                        populate: [
                            { path: "recruiterId", model: "recruiters" },
                            { path: "resume", model: "documents.files" },
                        ],
                    },
                    { path: "companyId", model: "companies" },
                ],
            },
            { path: "companyLogo" },
        ]);
    if (!result) {
        const error = new Error("No company  found.");
        error.statusCode = 401;
        throw error;
    }

    res.status(200).json({
      message: "Companies detail fetched successfully.",
      posts: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
