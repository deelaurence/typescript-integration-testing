import mongoose, { Schema, model, Document } from 'mongoose';
import bcrypt from "bcryptjs";
import jwt,{Secret} from "jsonwebtoken";
import { BoolEnum } from 'sharp';

interface IUser extends Document {
  generateJWT(JWT_SECRET: string | Secret): unknown;
  comparePassword(password: string | undefined): boolean;
  name: string;
  verified:boolean;
  // _id?:any;
  email?: {
    type: string;
    unique?: string|undefined;
    trim?: boolean|undefined;
    lowercase?: boolean|undefined;
    match?: [RegExp]|undefined;
  };
  password: string;
  googleId: string;
  canResetPassword:boolean;
  displayName: string;
  userId: string;
  provider:string;
  phoneNumber: string;
  gender: string;
  country:string;
   
  
}

const userSchema = new Schema<IUser>({
    name: {
      type: String,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    // _id: mongoose.Types.ObjectId,
    email: {
      type: String,
      lowercase:true,
      trim:true,
      unique: [true, "email already registered"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ],
    },
    password: {
      type: String,
      minlength: 6,
    },
    googleId: {
      type: String,
    },
    canResetPassword: {
      type: Boolean,
      default: false,
    },
    displayName: {
      type: String,
    },
    userId: {
      type: String,
    },
    provider: {
      type: String,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    }
  },
);


userSchema.pre('save', async function (this: IUser, next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    if (this.password && !this.password.startsWith('$2a')) {
      console.log('hashing password...');
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
  next();
});

userSchema.methods.generateJWT = function (this: IUser, signature: string): string {
  return jwt.sign({ id: this._id, name: this.name }, signature);
};

userSchema.methods.comparePassword = async function (
  this: IUser,
  passwordInput: string
): Promise<boolean> {
  return await bcrypt.compare(passwordInput, this.password);
};



const BaseUser = model<IUser>('User', userSchema);

export { BaseUser,IUser };
// export default model<IUser>('User', userSchema);
