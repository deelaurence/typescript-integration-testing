// const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI('AIzaSyBCu7CMAnDnyZAkqtkdbvog0LHsJEUc17U');
import { Request,Response } from "express";



// Access your API key as an environment variable (see "Set up your API key" above)

export async function generate(req:Request,res:Response) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const prompt:string = req.body.prompt

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  console.log(text);
  res.json({text})
}

