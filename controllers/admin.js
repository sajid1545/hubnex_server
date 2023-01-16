
const PrivacyPolicy = require('../models/privacyPolicy');
const TermsAndConditions = require('../models/TermsAndConditions');
const DataProtection = require('../models/dataProtection');
const PostedJob = require('../models/postJobs');
const Company = require('../models/company');
const Recruiter = require('../models/recruiters');
const Users = require('../models/users');
const AdminLogin = require('../models/LoginAdmin');
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
require('dotenv').config();
const fetch = require('node-fetch')


exports.updateTermsAndConditions = async (req, res, next) => {
    try {
        const { termsAndConditions } = req.body;

        // const posts = new TermsAndConditions({ termsAndConditions: termsAndConditions });
        // const result = await posts.save();
        const result = await TermsAndConditions.findOneAndUpdate({}, { termsAndConditions: termsAndConditions });
        if (!result) {
            throw new Error("Something went wrong.");
        }
        res.status(201).json({ 'message': "Terms and conditions updated successfully." });
    } catch (error) {
        next(error);
    }

};

exports.updatePrivacyPolicy = async (req, res, next) => {
    try {
        const { privacyPolicy } = req.body;
        // const posts= new PrivacyPolicy({privacyPolicy:privacyPolicy});
        // const result = await posts.save();
        const result = await PrivacyPolicy.findOneAndUpdate({}, { privacyPolicy: privacyPolicy });
        if (!result) {
            throw new Error("Something went wrong.");
        }
        res.status(201).json({ 'message': "Privacy Policy updated successfully." });
    } catch (error) {
        next(error);
    }

};

exports.updateDataProtection = async (req, res, next) => {
    try {
        const { dataProtection } = req.body;
        // const posts= new DataProtection({dataProtection:dataProtection});
        // const result = await posts.save();
        const result = await DataProtection.findOneAndUpdate({}, { dataProtection: dataProtection });
        if (!result) {
            throw new Error("Something went wrong.");
        }
        res.status(201).json({ 'message': "Data Protection updated successfully." });
    } catch (error) {
        next(error);
    }

};

exports.updateStatusOfPostedJob = async (req, res, next) => {
    const id = req.params.id;
    let notificationTitle, notificationBody;

    try {
        const { status } = req.body
        const data = await PostedJob.findByIdAndUpdate(id, { status: status }, { new: true });
        notificationTitle = `${data.role}, from admin`;
        notificationBody = `Job proposal for ${data.role}, has been ${data.status} by admin panel.`;
        /*-------------------------Sending Notification to company for update of status of job posted by them--------------------------- */
        await fetch('http://localhost:5000/admin/sendNotifications', {
            method: 'post',
            body: JSON.stringify({ notificationTitle: notificationTitle, notificationBody: notificationBody }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        /*---------------------Sending notification to recruiters if job is approved by admin panel-------------------------------------- */
        if (data.status === 'approved') {
            notificationTitle = `${data.companyName}, from admin`;
            notificationBody = `A new job has been posted by ${data.companyName}.`

            await fetch('http://localhost:5000/admin/sendNotifications', {
                method: 'post',
                body: JSON.stringify({ notificationTitle: notificationTitle, notificationBody: notificationBody }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        res.status(201).json({ message: 'Status of job successfully updated', posts: data });

    } catch (error) {
        next(error);
    }
};

exports.editCompany = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { companyName, companyWebsite, industry, contactNum1, contactNum2, headquarter, companySize, aboutUs, contactPerson, contactPersonEmail, contactPersonMobNo, companyAddress, _PAN, _CIN, _TAN, _GST, incorporationDate, linkedIn, facebook, twitter, instagram } = req.body;
        // console.log(companySize)
        const result = await Company.findById(id);
        if (!result) {
            const post = new Company({ _id: id, companyName, companyWebsite, industry, contactNum1, contactNum2, headquarter, companySize, aboutUs, contactPerson, contactPersonEmail, contactPersonMobNo, companyAddress, _PAN, _CIN, _TAN, _GST, incorporationDate, linkedIn, facebook, twitter, instagram });

            const result_2 = await post.save();
            if (!result_2) {
                throw new Error('something went wrong');
            }
            await Users.findByIdAndUpdate(id, { companyId: result_2._id, companyName: companyName });
            return res.status(201).json({ message: 'Company details successfully updated.', posts: result_2 });

        }
        await Users.findByIdAndUpdate(id, { companyName: companyName, phoneNumber: contactNum1 });

        const result_3 = await Company.findByIdAndUpdate(id, { companyName, companyWebsite, industry, contactNum1, contactNum2, headquarter, companySize, aboutUs, contactPerson, contactPersonEmail, contactPersonMobNo, companyAddress, _PAN, _CIN, _TAN, _GST, incorporationDate, linkedIn, facebook, twitter, instagram }, { new: true });

        if (!result_3) {
            throw new Error('Something went wrong.');
        }

        res.status(201).json({ message: "Company details successfully updated.", posts: result_3 });

    } catch (error) {
        next(error);
    }
}

exports.editRecruiter = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { fullName, email, dob, mobileNum1, mobileNum2, highestEducation, city, state, _PAN, _GST, accountHolderName, accountType, bankAccountNumber, bankName, ifscCode, swiftCode, linkedIn, facebook, twitter, instagram } = req.body;

        const result_3 = await Recruiter.findById(id);
        if (!result_3) {
            const post = new Recruiter({ _id: id, fullName, email, dob, mobileNum1, mobileNum2, highestEducation, city, state, _PAN, _GST, accountHolderName, accountType, bankAccountNumber, bankName, ifscCode, swiftCode, linkedIn, facebook, twitter, instagram, userId: id });
            const result = await post.save();
            await Users.findByIdAndUpdate(id, { recruiterId: result._id, fullName: fullName, email: email });
            return res.status(200).json({ message: 'Recruiter details successfully updated.', posts: result });
        }
        await Users.findByIdAndUpdate(id, { fullName: fullName, email: email });
        const result_4 = await Recruiter.findByIdAndUpdate(id, { fullName, email, dob, mobileNum1, mobileNum2, highestEducation, city, state, _PAN, _GST, accountHolderName, accountType, bankAccountNumber, bankName, ifscCode, swiftCode, linkedIn, facebook, twitter, instagram }, { new: true });

        res.status(200).json({ message: 'Recruiter details successfully updated.', posts: result_4 });

    } catch (error) {
        next(error);
    }
};

exports.editManageRoleUser = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { userName, email, mobile, password, Dashboard, company, manageRoles, forms, recruiter, referral, cms, payment, Applications, Invoices, Notifications, NeedHelp } = req.body;
        if (password) {
            const passwordHash = await bcrypt.hash(password, 10);
            const result_2 = await AdminLogin.findByIdAndUpdate(id, { password: passwordHash }, { new: true });
            if (!result_2) {
                throw new Error("something went wrong");
            }
        }

        const result = await AdminLogin.findByIdAndUpdate(id, { userName, email, mobile, password, Dashboard, company, manageRoles, forms, recruiter, referral, cms, payment, Applications, Invoices, Notifications, NeedHelp }, { new: true });
        if (!result) {
            throw new Error("something went wrong");
        }
        res.status(200).json({ message: "Updated successfully", posts: result });
        console.log(result);
    } catch (error) {
        next(error);
    }
}

exports.changeStatusOfUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const result = await Users.findById(userId);
        if (!result) {
            throw new Error("Something went wrong.");
        }
        let status = ((result.status).trim() === "Allow") ? "Block" : "Allow";
        const result_2 = await Users.findByIdAndUpdate(userId, { status: status }, { new: true });
        if (!result_2) {
            throw new Error("Something went wrong.");
        }
        res.status(201).json({ message: "Status updated successfully.", posts: result_2 });
    } catch (error) {
        next(error);
    }
};

exports.changeStatusOfManageRole = async (req, res, next) => {
    try {
        console.log(req.params);
        const { userId } = req.params;
        const id = userId
        console.log(id);
        const result = await AdminLogin.findById(id);
        // console.log(result, id);
        if (!result) {
            throw new Error("Something went wrong.");
        }
        let status = ((result.status) === "Allow") ? "Block" : "Allow";
        const result_2 = await AdminLogin.findByIdAndUpdate(id, { status: status }, { new: true });
        if (!result_2) {
            throw new Error("Something went wrong.");
        }
        res.status(201).json({ message: "Status updated successfully.", posts: result_2 });
    } catch (error) {
        next(error);
    }
};

/*-------------------------------------------Sends notifications in bulk------------------------------------------------------------- */
exports.sendNotifications = async (req, res, next) => {
    try {
        const { clientType } = req.body;
        const result_1 = await Users.find();
        const result_2 = await AdminLogin.find();
        let recruitersId = [], companiesId = [], adminsId = [];
        if (result_1) {
            result_1.forEach(element => {
                if (element.role === 'recruiter') {
                    if (element._id) {
                        recruitersId.push(element._id);
                    }

                } else {
                    if (element._id) {
                        companiesId.push(element._id);
                    }

                }
            });
        }
        if (result_2) {
            result_2.forEach(element => {
                if (element._id) {
                    adminsId.push(element._id);
                }

            });
        }

        let finalUsers = [];
        if (clientType === 'Recruiters') {
            finalUsers = recruitersId;
        }
        else if (clientType === 'Companies') {
            finalUsers = companiesId;
        }
        else if (clientType === "Admin") {
            finalUsers = adminsId;
        }
        else if (clientType === "Both") {
            finalUsers = recruitersId.concat(companiesId);
        }

        res.status(200).json({ message: "Users sent successfully", posts: finalUsers });
    }
    catch (error) {
        console.log('Error sending message:', error);
        res.status(500).json({ message: "something went wrong" });
    }

}

/*--------------------------------------------------Send notification by id-------------------------------------------------------- */
exports.sendNotificationsById = async (req, res, next) => {
    try {
        const { notificationTitle, notificationBody } = req.body;
        const { id } = req.params;
        let finalUser;
        const result_1 = await Users.findById(id);
        if (!result_1) {
            const result_2 = await AdminLogin.findById(id);
            if (!result_2) {
                throw new Error("Something went wrong");
            }
            finalUser = result_2.clientNotificationReg_Id;
        }
        if (result_1) {
            finalUser = result_1.clientNotificationReg_Id;
        }

        var message = {
            notification: {
                title: notificationTitle,
                body: notificationBody,
            },
            token: finalUser
        };

        // Send a message to devices subscribed to the provided topic.
        const response = await admin.messaging().send(message);

        // Response is a message ID string.
        console.log("Successfully sent message:", response);
        res
            .status(200)
            .json({ message: "Notification sent successfully", posts: response });
    } catch (error) {
        console.log("Error sending message:", error);
        res.status(500).json({ message: "something went wrong" });
    }
};

/*-----------------------------------------------get companies------------------------------------------------------------------- */
exports.getCompanies = async (req, res, next) => {
    try {

        const result = await Company.find().populate([
            {
                path: "jobPostedId",
                populate: [{ path: 'jobDetailsFile', model: 'documents.files' }, { path: "candidatesId", model: "candidateprofiles", populate: [{ path: 'recruiterId', model: 'recruiters' }, { path: 'resume', model: 'documents.files' }] }, { path: 'companyId', model: 'companies' }],
            },
            { path: "companyLogo" },
        ]);
        if (!result) {
            const error = new Error("No company  found.");
            error.statusCode = 401;
            throw error;
        }
        console.log(result);
        res
            .status(200)
            .json({
                message: "Companies detail fetched successfully.",
                posts: result,
            });
    } catch (error) {
        next(error);
    }

};