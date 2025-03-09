"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const generative_ai_1 = require("@google/generative-ai");
class Store {
    // Constructor
    constructor() {
        this.dataStore = {};
        this.config = {};
        this.extraInstructions = `
        Do not include explanations, categories, or additional text.
        Format the output as a single array of strings seperated by commas,
        no other symbol other than commas, quotes, square brackets
        no line breaks I want to be able to call JSON.parse() on it and
        send it to the frontend as a standard array of string
    `;
        this.geminiKey = process.env.GEMINI_KEY || "";
        if (!this.geminiKey)
            throw new Error("Gemini Key does not exist");
        this.genAI = new generative_ai_1.GoogleGenerativeAI(this.geminiKey); // Initialize the generative AI instance
    }
    // Function to set a value in the data store
    set(key, value) {
        this.dataStore[key] = value;
    }
    // Function to get a value from the data store
    get(key) {
        return this.dataStore[key];
    }
    // Function to check if a key exists in the data store
    has(key) {
        return this.dataStore.hasOwnProperty(key);
    }
    // Function to delete a value from the data store
    delete(key) {
        delete this.dataStore[key];
    }
    // Function to set a configuration value
    setConfig(key, value) {
        this.config[key] = value;
    }
    // Function to get a configuration value
    getConfig(key) {
        return this.config[key];
    }
    formatDate() {
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
        return formattedDate + ',' + formattedTime;
    }
    centralPrompt(jobTitle, number, category) {
        return `List exactly ${number} ${category} I used as a ${jobTitle}. 
        Use first person pronouns when applicable but dont start everything with I,
        Can start with a past tense verb
        ${this.extraInstructions}
        `;
    }
    promptEngine(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });
            const result = yield model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            console.log(prompt);
            return JSON.parse(text);
        });
    }
    // Function to recommend responsibilities
    recommendToolsAndSkills(jobTitle, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = query === 'tools' ?
                this.centralPrompt(jobTitle, 30, "tools")
                :
                    this.centralPrompt(jobTitle, 30, "skills");
            return yield this.promptEngine(prompt);
        });
    }
    // Function to recommend responsibilities
    recommendCareerSummary(jobTitle, skills, tools, yearsOfExperience) {
        return __awaiter(this, void 0, void 0, function* () {
            // For text-only input, use the gemini-1.5-pro-002 model
            let prompt = `
        I am generating a resume, I worked
        as a ${jobTitle} 
        I have ${yearsOfExperience} years of experience.
        Generate five(5)
        possible  career summaries I can use 
        ${this.extraInstructions}
        `;
            return yield this.promptEngine(prompt);
        });
    }
    // Method to clean actions: remove numbering and asterisks
    cleanActions(actionsArray) {
        let actionsWithoutNumbering = actionsArray.map(action => this.removeNumbering(action));
        actionsWithoutNumbering = actionsWithoutNumbering.map(action => this.removeAsterisks(action));
        return actionsWithoutNumbering;
    }
    cleanActionsV2(text) {
        const actionsArray = text
            .split('\n')
            .map(line => line.trim()) // Remove extra spaces
            .filter(line => line && !line.includes(':')); // Remove empty lines & category headers
        // If the model returns numbers (1. ToolName), remove them
        const cleanedActions = actionsArray.map(line => line.replace(/^\d+\.\s*/, ''));
        return cleanedActions;
    }
    // Method to remove numbering from a string
    removeNumbering(action) {
        return action.replace(/^\d+\.\s/, ''); // Removes leading numbering
    }
    // Method to remove asterisks from a string
    removeAsterisks(action) {
        return action.replace(/\*/g, ''); // Removes asterisks
    }
}
exports.default = Store;
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
