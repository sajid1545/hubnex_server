const TermsAndConditions = require("../models/TermsAndConditions");
const PrivacyPolicy = require("../models/privacyPolicy");
const DataProtection = require("../models/dataProtection");
const CandidatesProfile = require("../models/candidateProfiles");
const Users = require("../models/users");
const bcrypt = require("bcrypt");
const Recruiters = require("../models/recruiters");
const connection = require("../db");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const notifications = require("../models/notifications");
require("../models/documents.files");
const AdminLogin = require("../models/LoginAdmin");

let gfs, gridFsBucket;
connection();

const conn = mongoose.connection;
conn.once("open", function () {
  gridFsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "documents",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("documents");
});

exports.getTermsAndConditions = async (req, res, next) => {
  try {
    const result = await TermsAndConditions.findOne({});
    if (!result) {
      throw new Error("Something went wrong.");
    }

    res.status(200).json({
      message: "Terms and conditions fetched successfully.",
      posts: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPrivacyPolicy = async (req, res, next) => {
  try {
    const result = await PrivacyPolicy.findOne({});
    if (!result) {
      throw new Error("Something went wrong.");
    }

    res
      .status(200)
      .json({ message: "Privacy Policy fetched successfully.", posts: result });
  } catch (error) {
    next(error);
  }
};

exports.getDataProtection = async (req, res, next) => {
  try {
    const result = await DataProtection.findOne({});
    if (!result) {
      throw new Error("Something went wrong.");
    }

    res.status(200).json({
      message: "Data Protection fetched successfully.",
      posts: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCandidatesProfile = async (req, res, next) => {
  try {
    const result = await CandidatesProfile.find().sort({createdAt:-1})
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

    res.status(200).json({
      message: "Candidates profile successfully fetched.",
      posts: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getRecruiters = async (req, res, next) => {
  try {
    const userData = await Users.find({ role: "recruiter" })
      .populate("recruiterId")
      .exec();
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

exports.getCompanies = async (req, res, next) => {
  try {
    const userData = await Users.find({ role: "company" })
      .populate([
        {
          path: "companyId",
          populate: [
            { path: "companyLogo", model: "documents.files" },
            { path: "jobPostedId", model: "postjobs" },
          ],
        },
      ])
      .exec();

    res
      .status(200)
      .json({ message: "Data successfully fetched.", posts: userData });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Users.findById(id)
      .populate([
        {
          path: "recruiterId",
          populate: [
            { path: "claimedJobId", model: "postjobs" },
            { path: "profilePhoto", model: "documents.files" },
          ],
        },
        {
          path: "companyId",
          populate: [
            { path: "companyLogo", model: "documents.files" },
            { path: "jobPostedId", model: "postjobs" },
          ],
        },
      ])
      .exec();

    res
      .status(200)
      .json({ message: "User details successfully fetched.", posts: result });
  } catch (error) {
    next(error);
  }
};

exports.changeUserPassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { oldPassword, newPassword } = req.body;
    const userData = await Users.findById(id);
    const passwordCompare = await bcrypt.compare(
      oldPassword,
      userData.password
    );
    if (!passwordCompare) {
      const error = new Error("Invalid password entered.");
      error.statusCode = 401;
      throw error;
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const result = await Users.findByIdAndUpdate(
      id,
      { password: passwordHash },
      { new: true }
    );
    res
      .status(201)
      .json({ message: "Password changed successfully.", posts: result });
  } catch (error) {
    next(error);
  }
};

exports.getImage = async (req, res, next) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    const readStream = gridFsBucket.openDownloadStream(file._id);
    readStream.pipe(res);
  } catch (error) {
    res.send("not found");
  }
};

exports.updateClientNotificationReg_Id = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { clientNotificationReg_Id } = req.body;
    const result = await Users.findByIdAndUpdate(
      id,
      { clientNotificationReg_Id: clientNotificationReg_Id },
      { new: true }
    );
    if (!result) {
      throw new Error("Something went wrong.");
    }
    res.status(201).json({ message: "updated successfully.", posts: result });
  } catch (error) {
    next(error);
  }
};

/*--------------------------------------------------Saving Notification------------------------------------------------------------- */
exports.saveNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;
    const post = new notifications({ title, body, seen: false, userId: id });
    const result = await post.save();
    if (!result) {
      throw new Error("Something wrong went.");
    }
    res
      .status(201)
      .json({ message: "Notification saved successfully.", posts: result });
  } catch (error) {
    next(error);
  }
};

/*----------------------------------------------------fetch notifications-------------------------------------------------------------- */
exports.getNotificationByuserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("yes", id);
    const result = await notifications
      .find({ userId: id })
      .sort({ createdAt: -1 });
    if (!result) {
      throw new Error("Something wrong went.");
    }
  
    res
      .status(200)
      .json({ message: "Notifications fetched successfully", posts: result });
  } catch (error) {
    next(error);
  }
};

/*----------------------------------------------update notification----------------------------------------------------------------- */
exports.updateSeenNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await notifications.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true }
    );
    if (!result) {
      throw new Error("Something wrong went.");
    }
    res
      .status(200)
      .json({ message: "Notifications updated successfully", posts: result });
  } catch (error) {
    next(error);
  }
};

/*------------------------------------------------delete notification--------------------------------------------------------------- */
exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await notifications.findByIdAndDelete(id);
    if (!result) {
      throw new Error("Something wrong went.");
    }
    res
      .status(200)
      .json({ message: "Notifications deleted successfully", posts: result });
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------storing client notification reg. id------------------------------------------------------------- */
exports.storeClientNotificationReg_Id = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { clientNotificationReg_Id } = req.body;
    const result = await Users.findByIdAndUpdate(id, {
      clientNotificationReg_Id,
    });

    if (!result) {
      const result_2 = await AdminLogin.findByIdAndUpdate(id, {
        clientNotificationReg_Id,
      });
      if (!result_2) {
        throw new Error("Something went wrong.");
      }
      res
        .status(200)
        .json({ message: "Id stored successfully.", posts: result_2 });
    }
    res.status(200).json({ message: "Id stored successfully.", posts: result });
  } catch (error) {
    next(error);
  }
};
