import { Request, Response, raw } from 'express';
import  { Resume, IResume } from '../models/resume';
import { StatusCodes } from 'http-status-codes';
import { successResponse } from '../utils/customResponse';
import { BadRequest, NotFound, Unauthenticated, InternalServerError, Conflict } from "../errors/customErrors";
import {BaseUser, IUser} from '../models/user';
import { IRawResponsibility, RawResponsibility, Responsibility,IResponsibility } from '../models/resume';
import { recommendResponsibilities } from '../utils/prompt'
import { liberalPrompt } from '../utils/prompt';
//header section to add header
// 1 To user object if not already present
// 2 To resume object
const headerSection = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        lastName,
        firstName,
        city,
        profession,
        address,
        country,
        phoneNumber,
        publicEmail,
      } = req.body;
      
      const userId = req?.decoded?.id;
      
      let isFirstResume = true;
      const user = await BaseUser.findById(userId)
      if(!user){
        throw new NotFound("User does not exist")
      }
      if(user.publicEmail){
        //user has generated a resume before
        isFirstResume=false
      }

      //1 if user is generating resume for the first time
      //update user header details
      //2 Add an empty array in resumes field, would push the resume ID later
      if (isFirstResume) {
        // Perform update operation
        await BaseUser.findByIdAndUpdate(userId, {
            lastName,
            country,
            firstName,
            city,
            address,
            phoneNumber,
            publicEmail,
            resumes: [], // Initialize resumes field as an empty array
          });
        }
    
        const newResume: IResume = new Resume({
            firstName,
            lastName,
            profession,
            phoneNumber,
            publicEmail,
            country,
            city,
            createdBy:userId
          });
          


          // Save the new resume to the database
          const savedResume: IResume = await newResume.save();
          //push resumeId into the user document
          await BaseUser.findByIdAndUpdate(
            userId,
            { $push: { resumes:{profession,resume:savedResume._id}}}
          )

            


      res.status(201).json(successResponse(
         savedResume,StatusCodes.CREATED,"Bravo, your header section is completed now proceed to add your experience"
        ));
    } catch (error:any) {
      // Handle errors
      console.error(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new InternalServerError(error.message));
    }
};
  


//Add job experiences
const experienceSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      resumeId,
      jobTitle,
      company,
      city,
      country,
      startDate,
      endDate,
      currentlyWorking
    } = req.body;

    const resume = await Resume.findById(resumeId)
    if(!resume){
        throw new NotFound("Resume does not exist")
    }
    const profession = resume.profession

    const responsiblitiesRecommendations = await recommendResponsibilities(
        profession,company,jobTitle,city,country
    )

    






    if(resume.jobExperiences.length){
        // Try to update an existing job experience
            const tempUpdatedResume = await Resume.findOneAndUpdate(
              { _id: resumeId },
              {
                $set: {
                  'jobExperiences.$.company': company,
                  'jobExperiences.$.city': city,
                  'jobExperiences.$.country': country,
                  'jobExperiences.$.startDate': startDate,
                  'jobExperiences.$.endDate': endDate,
                  'jobExperiences.$.currentlyWorking': currentlyWorking,
                },
              },
              { new: true }
            );
                  // Respond with the saved resume
          res.status(201).json(successResponse(
            {resume:tempUpdatedResume,responsiblitiesRecommendations},
            StatusCodes.CREATED,
            `Dev_Mode_Preventing_Duplicates`
          ));
      return
    }







    // push experience into the experiences array
    const updatedResume:any =await Resume.findByIdAndUpdate(
      resumeId,
      { $push: { jobExperiences:{
        jobTitle,
        company,
        city,
        country,
        startDate,
        endDate,
        currentlyWorking
      } } },
      { new: true } 
    )
    
    //update raw responsibilities 
    const rawResponsibity: IRawResponsibility = new RawResponsibility({
        jobTitle,
        responsibilities:responsiblitiesRecommendations,
      });
    
    await rawResponsibity.save()





    // Respond with the saved resume
    res.status(201).json(successResponse(
        {resume:updatedResume,responsiblitiesRecommendations},
        StatusCodes.CREATED,
        `Setting up nicely, now add the responsibilities you carried out at ${company}`
      ));
  } catch (error:any) {
    // Handle errors
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(new InternalServerError(error.message));
  }
};


//Add responsibilities for experience
const responsibilitiesSection = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        resumeId,
        jobExperienceId,
        userResponsibilities,
      } = req.body;

      const resume = await Resume.findById(resumeId)
      if(!resume){
          throw new NotFound("Resume does not exist")
      }
      
      
      // Find the specific job experience within the jobExperiences array using its ID
    const jobExperience = resume.jobExperiences
    .find(exp => exp._id.equals(jobExperienceId));

    if (!jobExperience) {
      throw new Error('Job Experience not found');
    }
            
    //create new rresponsibility document
    const newResponsibility = await Responsibility.create(
        { jobTitle: jobExperience.jobTitle, responsibilities: userResponsibilities });
    //update job experience with new responsibility id
    
    jobExperience.responsibilities=newResponsibility._id
    await resume.save()
    const updatedResume: any = await Resume.findById(resumeId)
      // Respond with the saved resume
      res.status(201).json(successResponse(
          updatedResume,
          StatusCodes.CREATED,
          `Cool! you added (${userResponsibilities.length}) responsibilities to your job role at ${jobExperience.company} `
        ));
    } catch (error:any) {
      // Handle errors
      console.error(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new InternalServerError(error.message));
    }
  };

  
//Add education
const educationSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      resumeId,
      schoolName,
      schoolLocation,
      degreeType,
      studyField,
      startDate,
      graduationDate,
      stillEnrolled
    } = req.body;

    const resume = await Resume.findById(resumeId)
    if(!resume){
        throw new NotFound("Resume does not exist")
    }
    
    // push school into the education array
    const updatedResume:any =await Resume.findByIdAndUpdate(
      resumeId,
      { $push: { education:{
        schoolName,
        schoolLocation,
        degreeType,
        studyField,
        startDate,
        graduationDate,
        stillEnrolled
      } } },
      { new: true } 
    )
    

    // Respond with the saved resume
    res.status(201).json(successResponse(
        updatedResume,
        StatusCodes.CREATED,
        `You added ${schoolName} as a school where you obtained a ${degreeType} degree`
      ));
  } catch (error:any) {
    // Handle errors
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(new InternalServerError(error.message));
  }
};



const liberalPrompting = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      prompt
    } = req.body;

    
    const result = await liberalPrompt(prompt)

    // Respond with the saved resume
    res.status(201).json(successResponse(
        result,
        StatusCodes.CREATED,
        `Your results for the prompt [${prompt}]`
      ));
  } catch (error:any) {
    // Handle errors
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(new InternalServerError(error.message));
  }
};


export { liberalPrompting, experienceSection, headerSection, responsibilitiesSection, educationSection };
