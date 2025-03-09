require("dotenv").config();
import { GoogleGenerativeAI } from "@google/generative-ai";


class Store {
    private dataStore: { [key: string]: any } = {};
    public config: { [key: string]: any } = {};
    private genAI: GoogleGenerativeAI;
    private geminiKey: string;
    // Constructor
    constructor() {
        this.geminiKey = process.env.GEMINI_KEY||"";
        if (!this.geminiKey) throw new Error("Gemini Key does not exist");

        this.genAI = new GoogleGenerativeAI(this.geminiKey); // Initialize the generative AI instance
    }

    // Function to set a value in the data store
    public set(key: string, value: any): void {
        this.dataStore[key] = value;
    }

    // Function to get a value from the data store
    public get(key: string): any {
        return this.dataStore[key];
    }

    // Function to check if a key exists in the data store
    public has(key: string): boolean {
        return this.dataStore.hasOwnProperty(key);
    }

    // Function to delete a value from the data store
    public delete(key: string): void {
        delete this.dataStore[key];
    }

    // Function to set a configuration value
    public setConfig(key: string, value: any): void {
        this.config[key] = value;
    }

    // Function to get a configuration value
    public getConfig(key: string): any {
        return this.config[key];
    }


    formatDate(){
        const currentDate = new Date();

        const options = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        };
        //@ts-ignore
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);

        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        const formattedTime = `${hours}:${minutes}:${seconds}`;
        return formattedDate + ',' + formattedTime    
    }


    extraInstructions=`
        Do not include explanations, categories, or additional text.
        Format the output as a single array of strings seperated by commas,
        no other symbol other than commas, quotes, square brackets
        no line breaks I want to be able to call JSON.parse() on it and
        send it to the frontend as a standard array of string
    `

    public centralPrompt (jobTitle:string, number:number, category:string){
        
        return `List exactly ${number} ${category} I used as a ${jobTitle}. 
        Use first person pronouns when applicable but dont start everything with I,
        Can start with a past tense verb
        ${this.extraInstructions}
        `
    }


    public async promptEngine(prompt:string){  
        const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });
   
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        console.log(prompt);
        return JSON.parse(text)
    }

    // Function to recommend responsibilities
    public async recommendToolsAndSkills(
        jobTitle: string,
        query:string
    ): Promise<string[]> {
        const prompt: string = query === 'tools' ?
            this.centralPrompt(jobTitle,30,"tools")
            :   
            this.centralPrompt(jobTitle,30,"skills");

        return await this.promptEngine(prompt)
    }

     // Function to recommend responsibilities
     public async recommendCareerSummary(
        jobTitle: string,
        skills: string,
        tools: string,
        yearsOfExperience: number
    ): Promise<string[]> {
        // For text-only input, use the gemini-1.5-pro-002 model

        let prompt: string = `
        I am generating a resume, I worked
        as a ${jobTitle} 
        I have ${yearsOfExperience} years of experience.
        Generate five(5)
        possible  career summaries I can use 
        ${this.extraInstructions}
        `
        return await this.promptEngine(prompt)

    }


    // Method to clean actions: remove numbering and asterisks
    private cleanActions(actionsArray: string[]): string[] {
        let actionsWithoutNumbering = actionsArray.map(action => this.removeNumbering(action));
        actionsWithoutNumbering = actionsWithoutNumbering.map(action => this.removeAsterisks(action));
        return actionsWithoutNumbering;
    }


    private cleanActionsV2(text:string){
        const actionsArray = text
            .split('\n')
            .map(line => line.trim()) // Remove extra spaces
            .filter(line => line && !line.includes(':')) // Remove empty lines & category headers

        // If the model returns numbers (1. ToolName), remove them
        const cleanedActions = actionsArray.map(line => line.replace(/^\d+\.\s*/, ''));
        return cleanedActions
    }


    // Method to remove numbering from a string
    private removeNumbering(action: string): string {
        return action.replace(/^\d+\.\s/, ''); // Removes leading numbering
    }

    // Method to remove asterisks from a string
    private removeAsterisks(action: string): string {
        return action.replace(/\*/g, ''); // Removes asterisks
    }
}


export default Store


// import express from 'express';
// import store from './store';

// const router = express.Router();

// // Route to get a configuration value
// router.get('/config', (req, res) => {
//     const appName = store.getConfig('appName');
//     res.send(`App Name: ${appName}`);
// });

// // Route to store and retrieve data
// router.post('/data', (req, res) => {
//     const { key, value } = req.body;
//     store.set(key, value);
//     res.send(`Stored ${key}: ${value}`);
// });

// router.get('/data/:key', (req, res) => {
//     const key = req.params.key;
//     const value = store.get(key);
//     res.send(`Retrieved ${key}: ${value}`);
// });

// // Route to recommend responsibilities
// router.post('/recommend', async (req, res) => {
//     const { profession, company, jobTitle, city, country } = req.body;
//     const responsibilities = await store.recommendResponsibilities(profession, company, jobTitle, city, country);
//     res.json(responsibilities);
// });

// export default router;
