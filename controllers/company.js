const PostJobs = require('../models/postJobs');
const Documents = require("../models/documents.files");
const Company = require('../models/company');
const Users = require('../models/users');
const fetch = require('node-fetch')
exports.postJob = async (req, res, next) => {
    try {
        const companyId = req.params.id;
        let fileId;
        if (req.file) {
            fileId = await Documents.findOne({ filename: req.file.filename });
        }
        const {
            qualifications,
            skills,
            jobTitle,
            jobType,
            experience,
            package,
            earnPerClosure,
            noticePeriod,
            location,
            communication,
            status,
            rewardType,
            responsibilities,
            benefits,
            Tech,
            Currency,
            format
        } = req.body;
        const post = new PostJobs({
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
            jobDetailsFile: fileId,
            companyId: companyId
        });

        const postedData = await post.save();
        await Company.findByIdAndUpdate(companyId, { $push: { jobPostedId: postedData._id } })

        res.status(200).json({ message: "Job successfully posted", posts: postedData });

    } catch (error) {
        next(error);
    }
};
exports.settingsCompany = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { profileName, tagLine, emailBranding, jdBranding, postJobBranding, contactNum1, contactNum2, email, twitter, facebook, linkedIn } = req.body;
        console.log(profileName);
        let fileId;
        if (req.file) {
            fileId = req.file.id;
            console.log(req.file);

        }

        const result_3 = await Company.findById(id);
        if (!result_3) {
            const post = new Company({
                _id: id,
                profileName,
                tagLine,
                emailBranding,
                jdBranding,
                postJobBranding,
                contactNum1,
                contactNum2,
                email,
                twitter,
                facebook,
                linkedIn,
                userId: id,
                companyLogo: fileId,
            });
            const result = await post.save();
            await Users.findByIdAndUpdate(id, { companyId: result._id, email: email, phoneNumber: contactNum1 });
            return res.status(200).json({ message: 'Company details successfully updated.', posts: result });
        }
        if (fileId) {
            await Users.findByIdAndUpdate(id, {
                rcompanyId: id,
                email: email,
                phoneNumber: contactNum1,
            });
            const result_5 = await Company.findByIdAndUpdate(
                id,
                {
                    profileName,
                    tagLine,
                    emailBranding,
                    jdBranding,
                    postJobBranding,
                    contactNum1,
                    contactNum2,
                    email,
                    twitter,
                    facebook,
                    linkedIn,
                    companyLogo: fileId,
                },
                { new: true }
            );
            return res.status(200).json({ message: 'Comapny details successfully updated.', posts: result_5 });
        }
        await Users.findByIdAndUpdate(id, { email: email, phoneNumber: contactNum1 });
        const result_4 = await Company.findByIdAndUpdate(
            id,
            {
                profileName,
                tagLine,
                emailBranding,
                jdBranding,
                postJobBranding,
                contactNum1,
                contactNum2,
                email,
                twitter,
                facebook,
                linkedIn,
            },
            { new: true }
        );


        res.status(200).json({ message: 'Company details successfully updated.', posts: result_4 });

    } catch (error) {
        next(error);
    }
};

/*--------------------------------------------------Get Company by id----------------------------------------------------------- */
exports.getCompanyById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Company.findById(id).populate([{ path: 'jobPostedId', populate: { path: 'candidatesId', model: 'candidateprofiles', populate: { path: 'resume', model: 'documents.files' } } }, { path: 'companyLogo' }]).exec();
        if (!result) {
            const error = new Error('No company with this id found.');
            error.statusCode = 401;
            throw error;
        }
        console.log(result);
        res.status(200).json({ message: "Company details fetched successfully.", posts: result });
    } catch (error) {
        next(error);
    }
};