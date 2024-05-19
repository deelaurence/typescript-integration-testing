import { Request, Response, raw } from 'express';
import  { Resume, IResume } from '../models/resume';
import { StatusCodes } from 'http-status-codes';
import { successResponse } from '../utils/customResponse';
import { BadRequest, NotFound, Unauthenticated, InternalServerError, Conflict } from "../errors/customErrors";
import {BaseUser, IUser} from '../models/user';
import { IRawResponsibility, RawResponsibility, Responsibility,IResponsibility } from '../models/resume';
import { recommendResponsibilities } from '../utils/prompt';

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
        isFirstResume?await BaseUser.findByIdAndUpdate(
          userId,
          {lastName,
            country,
            firstName,
            city,
            address,
            phoneNumber,
            publicEmail,
            resumes:[],
        },
        ):null;
      
    
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
         savedResume,StatusCodes.CREATED,"UPDATED"
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
        {updatedResume,responsiblitiesRecommendations},
        StatusCodes.CREATED,
        "CREATED"
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
          "CREATED"
        ));
    } catch (error:any) {
      // Handle errors
      console.error(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new InternalServerError(error.message));
    }
  };
  

export { experienceSection, headerSection, responsibilitiesSection };
