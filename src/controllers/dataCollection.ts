import { Request, Response, raw } from 'express';
import  { Resume, IResume } from '../models/resume';
import { StatusCodes } from 'http-status-codes';
import { successResponse } from '../utils/customResponse';
import { BadRequest, NotFound, Unauthenticated, InternalServerError, Conflict } from "../errors/customErrors";
import {BaseUser, IUser} from '../models/user';
import { IRawResponsibility, RawResponsibility, Responsibility,IResponsibility } from '../models/resume';
import { recommendResponsibilities } from '../utils/prompt'
import { liberalPrompt } from '../utils/prompt';
import Store from '../store/store';
const store = new Store()

//Create new resume and return the ID
const initializeResume = async(req:Request, res:Response): Promise<void>=>{
  try {
    const userId = req?.decoded?.id;
    

    //Ensure user has only one empty resume instance per time
    //if there is an empty instance, remove from resume documents
    const clearedResume: IResume|null = await Resume.findOneAndDelete({
      createdBy:userId,
      publicEmail:null
    })

    //REmove an empty resume instance from resumes field
    //in user object
    await BaseUser.findByIdAndUpdate(
      userId,
      { $pull: { resumes:clearedResume?._id}} 
    ) 
    const newResume: IResume = new Resume({
      createdBy:userId
    });
    await newResume.save()

    //Push resume into resumes field in user object
    await BaseUser.findByIdAndUpdate(
      userId,
      { $push: { resumes:newResume._id}}
    )
    res.status(201).json(successResponse(
      newResume,StatusCodes.CREATED,"This is the starting point, You can now add your header"
    ));
  } catch (error:any) {
     // Handle errors 
     console.error(error)
     res.status(StatusCodes.INTERNAL_SERVER_ERROR)
     .json(new InternalServerError(error.message));
  }
}




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
        resumeId,
        country,
        phoneNumber,
        publicEmail,
      } = req.body;
      
      const userId = req?.decoded?.id;
      
      
      const user = await BaseUser.findById(userId)
      if(!user){
        throw new NotFound("User does not exist")
      }
      


      if(!resumeId){
        throw new BadRequest("Supply resume Id")
      }


      //Make sure the user in session owns the resume
      const userOwnsResume = await BaseUser.findOne({
        _id: user._id,
        resumes: { $in: [resumeId] },
      });

      if(!userOwnsResume){
        throw new NotFound("User does not have this resume")
      }

      await BaseUser.findByIdAndUpdate(userId, {
          lastName,
          country,
          firstName,
          city,
          address,
          phoneNumber,
          publicEmail,
      });
    
    
      const savedResume: IResume|null = await Resume.findByIdAndUpdate(resumeId,{
          firstName,
          lastName,
          profession,
          phoneNumber,
          publicEmail,
          country,
          city,
      },{new:true});
          

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



    // if(resume.jobExperiences.length){
    //     // Try to update an existing job experience
    //         const tempUpdatedResume = await Resume.findOneAndUpdate(
    //           { _id: resumeId },
    //           {
    //             $set: {
    //               'jobExperiences.$.company': company,
    //               'jobExperiences.$.city': city,
    //               'jobExperiences.$.country': country,
    //               'jobExperiences.$.startDate': startDate,
    //               'jobExperiences.$.endDate': endDate,
    //               'jobExperiences.$.currentlyWorking': currentlyWorking,
    //             },
    //           },
    //           { new: true }
    //         );
    //               // Respond with the saved resume
    //       res.status(201).json(successResponse(
    //         {resume:tempUpdatedResume,responsiblitiesRecommendations},
    //         StatusCodes.CREATED,
    //         `Dev_Mode_Preventing_Duplicates`
    //       ));
    //   return
    // }



    
    //update raw responsibilities 
    const rawResponsibility: IRawResponsibility = new RawResponsibility({
      jobTitle,
      responsibilities:responsiblitiesRecommendations,
    });
  
    await rawResponsibility.save()

    //save raw responsibilities to experience
    // jobExperience.rawResponsibilities=rawResponsibility._id
    console.log(rawResponsibility._id);
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
        currentlyWorking,
        rawResponsibilities:rawResponsibility._id
      } } },
      { new: true } 
    )
    



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


//prompt skills and tools
const PromtskillsAndTools = async (req: Request, res: Response): Promise<void> => {
  try {
    const state = req.params.state;
    const {resumeId} = req.body
    if(!resumeId) throw new BadRequest('Supply resumeId')
    console.log(state)
    if(state!=='tools'&&state!=='skills') throw new NotFound('Route not found')
    const resume = await Resume.findById(resumeId)
    if(!resume){
        throw new NotFound("Resume does not exist")
    }
    
    const result = await store.recommendToolsAndSkills(
      resume.profession,state  
    )
    
    state=="skills"?
    resume.rawSkills = result:
    resume.rawTools = result;
    
    await resume.save()
    res.json(successResponse(resume,200,`${state} recommended`))
    
  } catch (error:any) {
    // Handle errors
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(new InternalServerError(error.message));
  }
};


//Add skills and tools
const skillsAndToolsSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      resumeId,
      payload
    } = req.body;

    const state = req.params.state;
    console.log(state)
    
    const resume = await Resume.findById(resumeId)
    if(!resume){
        throw new NotFound("Resume does not exist")
    }
    
     
    if (state=='tools') {
      resume.tools=payload
    } else {
      resume.skills=payload
    }
    
    await resume.save()

    // Respond with the saved resume
    res.status(201).json(successResponse(
        resume,
        StatusCodes.CREATED,
        `You added ${state}`
      ));
  } catch (error:any) {
    // Handle errors
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(new InternalServerError(error.message));
  }
};



//prompt career summary
const promptCareerSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const {resumeId} = req.body
    if(!resumeId) throw new BadRequest('Supply resumeId')
        const resume = await Resume.findById(resumeId)
    if(!resume){
        throw new NotFound("Resume does not exist")
    }
    
    let yearsOfExperience;
    let allJobsDate=resume.jobExperiences.map((experience)=>{
      return experience.startDate
    })
    const currentYear = new Date().getFullYear()
    const minYear = Math.min(...allJobsDate.map(date => new Date(date).getFullYear()));
    yearsOfExperience = currentYear - minYear;

    const result = await store.recommendCareerSummary(
      resume.profession,`[${resume.skills}]`,`[${resume.tools}]`,yearsOfExperience
    )
    
    
    
    
    resume.rawCareerSummary = result;
    
    await resume.save()
    res.json(successResponse(resume,200,`Career summary recommendations`))
    
  } catch (error:any) {
    // Handle errors
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(new InternalServerError(error.message));
  }
};


//Add skills and tools
const careerSummarySection = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      resumeId,
      careerSummary
    } = req.body;
    
    const resume = await Resume.findById(resumeId)
    if(!resume){
        throw new NotFound("Resume does not exist")
    }
    
  
    resume.careerSummary = careerSummary
    await resume.save()

    // Respond with the saved resume
    res.status(201).json(successResponse(
        resume,
        StatusCodes.CREATED,
        `You added your career summary`
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


export { liberalPrompting, experienceSection, headerSection, responsibilitiesSection, educationSection, initializeResume, PromtskillsAndTools, skillsAndToolsSection,promptCareerSummary, careerSummarySection};
