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
    // Function to recommend responsibilities
    recommendToolsAndSkills(jobTitle, query) {
        return __awaiter(this, void 0, void 0, function* () {
            // For text-only input, use the gemini-pro model
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = query == 'tools' ? `
        I am generating a resume, I worked
        as a ${jobTitle}, generate thirty(30) ${query} 
        I would have used to fit in my one page resume.
        ` :
                `I worked 
        as a ${jobTitle}, generate thirty(30) ${query} 
        I would have used.`;
            const result = yield model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            const actionsArray = text.split('\n');
            console.log(prompt);
            const cleanedActions = this.cleanActions(actionsArray);
            return cleanedActions;
        });
    }
    // Function to recommend responsibilities
    recommendCareerSummary(jobTitle, skills, tools, yearsOfExperience) {
        return __awaiter(this, void 0, void 0, function* () {
            // For text-only input, use the gemini-pro model
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `
        I am generating a resume, I worked
        as a ${jobTitle} using these skills ${skills},
        and these tools ${tools}.
        I have ${yearsOfExperience} years of experience.
        Generate five(5)
        possible  career summaries I can use 
        `;
            const result = yield model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            const actionsArray = text.split('\n');
            console.log(prompt);
            const cleanedActions = this.cleanActions(actionsArray);
            return cleanedActions;
        });
    }
    // Method to clean actions: remove numbering and asterisks
    cleanActions(actionsArray) {
        let actionsWithoutNumbering = actionsArray.map(action => this.removeNumbering(action));
        actionsWithoutNumbering = actionsWithoutNumbering.map(action => this.removeAsterisks(action));
        return actionsWithoutNumbering;
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
