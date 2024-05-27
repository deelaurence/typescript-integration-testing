import mongoose, { Schema, model, Document } from 'mongoose';


//INTERFACES


interface IResponsibility extends Document {
  jobTitle: string;
  responsibilities: string[]; 
}


interface IRawResponsibility extends Document {
  jobTitle: string;
  responsibilities: string[]; 
}


interface IResume extends Document {
  jobTitle: string;
  createdBy: mongoose.Types.ObjectId;
  city:string;
  country:string;
  phoneNumber:string;
  profession:string;
  firstName:string;
  lastName:string;
  publicEmail?: {
    type: string;
    trim?: boolean|undefined;
    lowercase?: boolean|undefined;
    match?: [RegExp]|undefined;
  };
  
  jobExperiences: {
    _id: mongoose.Types.ObjectId;
    jobTitle: string;
    company: string;
    country: string;
    city: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    responsibilities: mongoose.Types.ObjectId;
  }[];


  education: {
    _id: mongoose.Types.ObjectId;
    schoolName: string;
    schoolLocation: string;
    degreeType: string;
    studyField: string;
    startDate: string;
    graduationDate: string;
    stillEnrolled: boolean;
  }[];
}





//SCHEMA DEFINITIONS


const responsibilitySchema = new Schema<IResponsibility>({
  jobTitle: {
    type: String,
    required: true,
  },
  responsibilities: [{
    type: String,
    required: true,
  }],
});


const RawResponsibilitySchema = new Schema<IRawResponsibility>({
  jobTitle: {
    type: String,
    required: true,
  },
  responsibilities: [{
    type: String,
    required: true,
  }],
});



const resumeSchema = new Schema<IResume>({
  
  profession: {
    type: String,
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  city: {
    type: String,
  },
  phoneNumber:{
    type: String
  },
  country: {
    type: String,
  },
  publicEmail: {
    type: String,
    lowercase:true,
    trim:true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ],
  },
  jobExperiences: [
    {
      jobTitle: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      startDate: {
        type: String,
        required: true,
      },
      endDate:{
        type:String
      },
      currentlyWorking: {
        type: Boolean,
      },
      responsibilities: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Responsibility',
      },
    },
  ],
  education: [
    {
      schoolName: {
        type: String,
        required: true,
      },
      schoolLocation: {
        type: String,
        required: true,
      },
      degreeType: {
        type: String,
        required: true,
      },
      studyField: {
        type: String,
        required: true,
      },
      startDate: {
        type: String,
        required: true,
      },
      graduationDate:{
        type:String
      },
      stillEnrolled: {
        type: Boolean,
      }},],
});




//EXPORTS


const Resume = model<IResume>('Resume', resumeSchema);

export {IResume, Resume};


const RawResponsibility = model<IRawResponsibility>('RawResponsibility', RawResponsibilitySchema);

export { IRawResponsibility, RawResponsibility };


const Responsibility = model<IResponsibility>('Responsibility', responsibilitySchema);

export { IResponsibility, Responsibility };
