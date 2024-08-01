"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeResume = exports.educationSection = exports.responsibilitiesSection = exports.headerSection = exports.experienceSection = exports.liberalPrompting = void 0;
const resume_1 = require("../models/resume");
const http_status_codes_1 = require("http-status-codes");
const customResponse_1 = require("../utils/customResponse");
const customErrors_1 = require("../errors/customErrors");
const user_1 = require("../models/user");
const resume_2 = require("../models/resume");
const prompt_1 = require("../utils/prompt");
const prompt_2 = require("../utils/prompt");
//Create new resume and return the ID
const initializeResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req === null || req === void 0 ? void 0 : req.decoded) === null || _a === void 0 ? void 0 : _a.id;
        //Ensure user has only one empty resume instance per time
        //if there is an empty instance, remove from resume documents
        const clearedResume = yield resume_1.Resume.findOneAndDelete({
            createdBy: userId,
            publicEmail: null
        });
        //REmove an empty resume instance from resumes field
        //in user object
        yield user_1.BaseUser.findByIdAndUpdate(userId, { $pull: { resumes: clearedResume === null || clearedResume === void 0 ? void 0 : clearedResume._id } });
        const newResume = new resume_1.Resume({
            createdBy: userId
        });
        yield newResume.save();
        //Push resume into resumes field in user object
        yield user_1.BaseUser.findByIdAndUpdate(userId, { $push: { resumes: newResume._id } });
        res.status(201).json((0, customResponse_1.successResponse)(newResume, http_status_codes_1.StatusCodes.CREATED, "This is the starting point, You can now add your header"));
    }
    catch (error) {
        // Handle errors 
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.initializeResume = initializeResume;
//header section to add header
// 1 To user object if not already present
// 2 To resume object
const headerSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { lastName, firstName, city, profession, address, resumeId, country, phoneNumber, publicEmail, } = req.body;
        const userId = (_b = req === null || req === void 0 ? void 0 : req.decoded) === null || _b === void 0 ? void 0 : _b.id;
        const user = yield user_1.BaseUser.findById(userId);
        if (!user) {
            throw new customErrors_1.NotFound("User does not exist");
        }
        if (!resumeId) {
            throw new customErrors_1.BadRequest("Supply resume Id");
        }
        //Make sure the user in session owns the resume
        const userOwnsResume = yield user_1.BaseUser.findOne({
            _id: user._id,
            resumes: { $in: [resumeId] },
        });
        if (!userOwnsResume) {
            throw new customErrors_1.NotFound("User does not have this resume");
        }
        yield user_1.BaseUser.findByIdAndUpdate(userId, {
            lastName,
            country,
            firstName,
            city,
            address,
            phoneNumber,
            publicEmail,
        });
        const savedResume = yield resume_1.Resume.findByIdAndUpdate(resumeId, {
            firstName,
            lastName,
            profession,
            phoneNumber,
            publicEmail,
            country,
            city,
        }, { new: true });
        res.status(201).json((0, customResponse_1.successResponse)(savedResume, http_status_codes_1.StatusCodes.CREATED, "Bravo, your header section is completed now proceed to add your experience"));
    }
    catch (error) {
        // Handle errors
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.headerSection = headerSection;
//Add job experiences
const experienceSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resumeId, jobTitle, company, city, country, startDate, endDate, currentlyWorking } = req.body;
        const resume = yield resume_1.Resume.findById(resumeId);
        if (!resume) {
            throw new customErrors_1.NotFound("Resume does not exist");
        }
        const profession = resume.profession;
        const responsiblitiesRecommendations = yield (0, prompt_1.recommendResponsibilities)(profession, company, jobTitle, city, country);
        if (resume.jobExperiences.length) {
            // Try to update an existing job experience
            const tempUpdatedResume = yield resume_1.Resume.findOneAndUpdate({ _id: resumeId }, {
                $set: {
                    'jobExperiences.$.company': company,
                    'jobExperiences.$.city': city,
                    'jobExperiences.$.country': country,
                    'jobExperiences.$.startDate': startDate,
                    'jobExperiences.$.endDate': endDate,
                    'jobExperiences.$.currentlyWorking': currentlyWorking,
                },
            }, { new: true });
            // Respond with the saved resume
            res.status(201).json((0, customResponse_1.successResponse)({ resume: tempUpdatedResume, responsiblitiesRecommendations }, http_status_codes_1.StatusCodes.CREATED, `Dev_Mode_Preventing_Duplicates`));
            return;
        }
        // push experience into the experiences array
        const updatedResume = yield resume_1.Resume.findByIdAndUpdate(resumeId, { $push: { jobExperiences: {
                    jobTitle,
                    company,
                    city,
                    country,
                    startDate,
                    endDate,
                    currentlyWorking
                } } }, { new: true });
        //update raw responsibilities 
        const rawResponsibity = new resume_2.RawResponsibility({
            jobTitle,
            responsibilities: responsiblitiesRecommendations,
        });
        yield rawResponsibity.save();
        // Respond with the saved resume
        res.status(201).json((0, customResponse_1.successResponse)({ resume: updatedResume, responsiblitiesRecommendations }, http_status_codes_1.StatusCodes.CREATED, `Setting up nicely, now add the responsibilities you carried out at ${company}`));
    }
    catch (error) {
        // Handle errors
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.experienceSection = experienceSection;
//Add responsibilities for experience
const responsibilitiesSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resumeId, jobExperienceId, userResponsibilities, } = req.body;
        const resume = yield resume_1.Resume.findById(resumeId);
        if (!resume) {
            throw new customErrors_1.NotFound("Resume does not exist");
        }
        // Find the specific job experience within the jobExperiences array using its ID
        const jobExperience = resume.jobExperiences
            .find(exp => exp._id.equals(jobExperienceId));
        if (!jobExperience) {
            throw new Error('Job Experience not found');
        }
        //create new rresponsibility document
        const newResponsibility = yield resume_2.Responsibility.create({ jobTitle: jobExperience.jobTitle, responsibilities: userResponsibilities });
        //update job experience with new responsibility id
        jobExperience.responsibilities = newResponsibility._id;
        yield resume.save();
        const updatedResume = yield resume_1.Resume.findById(resumeId);
        // Respond with the saved resume
        res.status(201).json((0, customResponse_1.successResponse)(updatedResume, http_status_codes_1.StatusCodes.CREATED, `Cool! you added (${userResponsibilities.length}) responsibilities to your job role at ${jobExperience.company} `));
    }
    catch (error) {
        // Handle errors
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.responsibilitiesSection = responsibilitiesSection;
//Add education
const educationSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resumeId, schoolName, schoolLocation, degreeType, studyField, startDate, graduationDate, stillEnrolled } = req.body;
        const resume = yield resume_1.Resume.findById(resumeId);
        if (!resume) {
            throw new customErrors_1.NotFound("Resume does not exist");
        }
        // push school into the education array
        const updatedResume = yield resume_1.Resume.findByIdAndUpdate(resumeId, { $push: { education: {
                    schoolName,
                    schoolLocation,
                    degreeType,
                    studyField,
                    startDate,
                    graduationDate,
                    stillEnrolled
                } } }, { new: true });
        // Respond with the saved resume
        res.status(201).json((0, customResponse_1.successResponse)(updatedResume, http_status_codes_1.StatusCodes.CREATED, `You added ${schoolName} as a school where you obtained a ${degreeType} degree`));
    }
    catch (error) {
        // Handle errors
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.educationSection = educationSection;
const liberalPrompting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prompt } = req.body;
        const result = yield (0, prompt_2.liberalPrompt)(prompt);
        // Respond with the saved resume
        res.status(201).json((0, customResponse_1.successResponse)(result, http_status_codes_1.StatusCodes.CREATED, `Your results for the prompt [${prompt}]`));
    }
    catch (error) {
        // Handle errors
        console.error(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new customErrors_1.InternalServerError(error.message));
    }
});
exports.liberalPrompting = liberalPrompting;
