// const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI('AIzaSyBCu7CMAnDnyZAkqtkdbvog0LHsJEUc17U');


// Access your API key as an environment variable (see "Set up your API key" above)

export async function recommendResponsibilities(
    profession:string,
    company:string,
    jobTitle:string,
    city:string,
    country:string
) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const prompt:string = `
  I am a ${jobTitle} and I worked at ${company}
  in ${city}, ${country}
  as a ${jobTitle} generate twenty(20) responsibilities
  I would have carried out in past tense.
  `
  

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const actionsArray = text.split('\n');

  console.log(prompt);
  const actionsWithoutNumbering = actionsArray.map(action => action.replace(/^\d+\.\s/, ''));
//   console.log(actionsWithoutNumbering);
return actionsWithoutNumbering;

}

