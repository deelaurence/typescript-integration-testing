require("dotenv").config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import Store from "../store/store";
const store = new Store()


const geminiKey=process.env.GEMINI_KEY
//@ts-ignore
const genAI = new GoogleGenerativeAI(geminiKey);

// Access your API key as an environment variable (see "Set up your API key" above)

export async function recommendResponsibilities(
    profession:string,
    company:string,
    jobTitle:string,
    city:string,
    country:string
) {
  // For text-only input, use the gemini-1.5-pro-002 model
  // const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002"});
  // For text-only input, use the gemini-1.5-pro-002 model
  
  const prompt:string = `
  I am a ${jobTitle} and I worked at ${company}
  in ${city}, ${country}
  as a ${jobTitle} generate twenty(20) responsibilities
  I would have carried out in past tense.
  ${store.extraInstructions}
  `
  const result = await store.promptEngine(prompt)
  return result;

}



export async function liberalPrompt(
  prompt:string,
) {
// For text-only input, use the gemini-1.5-pro-002 model
const text = await store.promptEngine(`${prompt} ${store.extraInstructions}`)
return text;

}



