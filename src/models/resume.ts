import mongoose, { Schema, model, Document } from 'mongoose';

interface IResponsibility extends Document {
  jobTitle: string;
  responsibilities: string[]; // Array of strings
  // Add any other fields for responsibilities
}

const responsibilitySchema = new Schema<IResponsibility>({
  jobTitle: {
    type: String,
    required: true,
  },
  responsibilities: [{
    type: String,
    required: true,
  }],
  // Add any other fields for responsibilities
});

const Responsibility = model<IResponsibility>('Responsibility', responsibilitySchema);

export { IResponsibility, Responsibility };

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
}

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
});

const Resume = model<IResume>('Resume', resumeSchema);

export {IResume, Resume};


interface IRawResponsibility extends Document {
  jobTitle: string;
  responsibilities: string[]; // Array of strings
  // Add any other fields for responsibilities
}

const RawResponsibilitySchema = new Schema<IRawResponsibility>({
  jobTitle: {
    type: String,
    required: true,
  },
  responsibilities: [{
    type: String,
    required: true,
  }],
  // Add any other fields for responsibilities
});

const RawResponsibility = model<IRawResponsibility>('RawResponsibility', RawResponsibilitySchema);

export { IRawResponsibility, RawResponsibility };
