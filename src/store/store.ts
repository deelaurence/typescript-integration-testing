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

    // Function to recommend responsibilities
    public async recommendToolsAndSkills(
        jobTitle: string,
        query:string
    ): Promise<string[]> {
        // For text-only input, use the gemini-pro model
        const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt: string = query=='tools' ?`
        I am generating a resume, I worked
        as a ${jobTitle}, generate thirty(30) ${query} 
        I would have used to fit in my one page resume.
        `:
        `I worked 
        as a ${jobTitle}, generate thirty(30) ${query} 
        I would have used.`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        
        const text = response.text();
        const actionsArray = text.split('\n'); 

        console.log(prompt);
        const cleanedActions = this.cleanActions(actionsArray);
        return cleanedActions;
    }

     // Function to recommend responsibilities
     public async recommendCareerSummary(
        jobTitle: string,
        skills: string,
        tools: string,
        yearsOfExperience: number
    ): Promise<string[]> {
        // For text-only input, use the gemini-pro model
        const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt: string = `
        I am generating a resume, I worked
        as a ${jobTitle} using these skills ${skills},
        and these tools ${tools}.
        I have ${yearsOfExperience} years of experience.
        Generate five(5)
        possible  career summaries I can use 
        `
        const result = await model.generateContent(prompt);
        const response = result.response;
        
        const text = response.text();
        const actionsArray = text.split('\n'); 

        console.log(prompt);
        const cleanedActions = this.cleanActions(actionsArray);
        return cleanedActions;
    }


    // Method to clean actions: remove numbering and asterisks
    private cleanActions(actionsArray: string[]): string[] {
        let actionsWithoutNumbering = actionsArray.map(action => this.removeNumbering(action));
        actionsWithoutNumbering = actionsWithoutNumbering.map(action => this.removeAsterisks(action));
        return actionsWithoutNumbering;
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
