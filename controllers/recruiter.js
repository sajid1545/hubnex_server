const CandidateProfiles = require('../models/candidateProfiles');
const PostedJobs = require('../models/postJobs');
const Recruiters = require('../models/recruiters');
const connection = require('../db');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const Users = require('../models/users');
const Documents = require('../models/documents.files');
const ClaimedPositions = require('../models/claimedPositions');
const fetch = require('node-fetch')




/*-----------------------------------for file uploading------------------------------------------------------------------------------- */
let gfs, gridFsBucket;
connection();

const conn = mongoose.connection;
conn.once('open', function () {
    gridFsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'photos'
    });
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("photos");
});

/*------------------------------------------------------------------------------------------------------------------------------------- */

exports.getOpenPositions = async (req, res, next) => {
    try {
        const result = await PostedJobs.find().sort({ createdAt: -1 }).populate([{ path: 'companyId', populate: { path: 'companyLogo', model: 'documents.files' } }, { path: 'jobDetailsFile' }]).exec();
        if (!result) {
            const error = new Error('No open positions found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ message: 'Open positions successfully fetched.', posts: result })
    } catch (error) {
        next(error);
    }
};

exports.claimPosition = async (req, res, next) => {
    try {
        const { jobId, userId } = req.params;
        const post = new ClaimedPositions({ jobId, recruiterId: userId });
        const result = await PostedJobs.findByIdAndUpdate(jobId, { $push: { recruiterIdClaimed: userId } });
        const result_2 = await Users.findById(userId);
        const result_3 = await Recruiters.findByIdAndUpdate(result_2._id, { $push: { claimedJobId: jobId } });
        const result_4 = await post.save();

        res.status(201).json({ message: "Position successfully claimed.", posts: [result, result_3, result_4] });
    } catch (error) {
        next(error);

    }
};

exports.getClaimedPositions = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const result = await ClaimedPositions.find({ recruiterId: userId })
            .sort({ createdAt: -1 })
            .populate([
                { path: "recruiterId" },
                {
                    path: "jobId",
                    populate: {
                        path: "companyId",
                        model: "companies",
                        populate: { path: "companyLogo", model: "documents.files" },
                    },
                },
            ])
            .exec();

        if (!result) {
            const error = new Error('No claimed position found for given user id.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ message: "Claimed positions successfully found.", posts: result });
    } catch (error) {
        next(error);
    }
};

exports.addCandidate = async (req, res, next) => {
    try {
        let { jobId, recruiterId } = req.params;
        // console.log(req.params);
        const { name, email, phoneNumber, experience, currentWorking, last_or_current_ctc, expected_ctc, noticePeriod, lastWorkingDay, currentLocation, readyToRelocate, noticePeriodBuyoutAvailable, additionalLinks, remarks } = req.body;
        // console.log(typeof recruiterId)
        recruiterId = recruiterId.trim();

        let resumeId;
        let additionalFilesIds = [];

        let x = req.files;
        // console.log("heelo",req.files);
        if (req.files === undefined) {
            return res.status(400).json({ message: "you must select a file." });
        }
        else {
            if (req.files['resume']) {
                resumeId = req.files['resume'][0].id;
            }

            if (req.files['additionalFiles']) {
                req.files['additionalFiles'].forEach(element => {
                    additionalFilesIds.push(element.id);
                });
            }

        }

        const post = new CandidateProfiles({ name, email, phoneNumber, experience, currentWorking, last_or_current_ctc, expected_ctc, noticePeriod, lastWorkingDay, currentLocation, readyToRelocate, noticePeriodBuyoutAvailable, additionalLinks, remarks, jobId, recruiterId: recruiterId, resume: resumeId, additionalFiles: additionalFilesIds, status: "Submitted" });

        const result = await post.save();
        await Recruiters.findByIdAndUpdate(recruiterId, {
            $push: { candidatesId: result._id },
        });
        await PostedJobs.findByIdAndUpdate(jobId, {
            $push: { candidatesId: result._id },
        });
        if (!result) {
            throw new Error("Something went wrong.");
        }
        const notificationTitle = `Candidate:${name}`;
        const notificationBody = `A new candidate has been added by recruiter for job id :${jobId}. Please acknowledge it !`;
        await fetch("http://localhost:5000/admin/sendNotifications", {
            method: "post",
            body: JSON.stringify({
                notificationTitle: notificationTitle,
                notificationBody: notificationBody,
                clientType: "Admin",
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        //console.log(result);
        res.status(201).json({ message: "Candidate profile added successfully.", posts: result });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.settingsRecruiter = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { fullName, email, userName, introduction, mobileNum1, mobileNum2 } = req.body;
        let fileId;
        if (req.file) {
            fileId = req.file.id;
        }
        const result_3 = await Recruiters.findById(id);
        if (!result_3) {
            const post = new Recruiters({ _id: id, fullName, email, userName, introduction, mobileNum1, mobileNum2, userId: id, profilePhoto: fileId });
            const result = await post.save();
            await Users.findByIdAndUpdate(id, { recruiterId: result._id, fullName: fullName, email: email, phoneNumber: mobileNum1 });
            return res.status(200).json({ message: 'Recruiter details successfully updated.', posts: result });
        }
        if (req.file) {
            fileId = req.file.id;
            await Users.findByIdAndUpdate(id, { fullName: fullName, email: email, phoneNumber: mobileNum1 });
            const result_5 = await Recruiters.findByIdAndUpdate(id, { fullName, email, mobileNum1, mobileNum2, userName, introduction, profilePhoto: fileId }, { new: true });

            return res.status(200).json({ message: 'Personal details successfully updated.', posts: result_5 });

        }
        await Users.findByIdAndUpdate(id, { fullName: fullName, email: email, phoneNumber: mobileNum1 });
        const result_4 = await Recruiters.findByIdAndUpdate(id, { fullName: fullName, email: email, mobileNum1: mobileNum1, mobileNum2: mobileNum2, userName: userName, introduction: introduction }, { new: true });

        res.status(200).json({ message: 'Personal details successfully updated.', posts: result_4 });

    } catch (error) {
        next(error);
    }
};