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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.liberalPrompt = exports.recommendResponsibilities = void 0;
require("dotenv").config();
const generative_ai_1 = require("@google/generative-ai");
const store_1 = __importDefault(require("../store/store"));
const store = new store_1.default();
const geminiKey = process.env.GEMINI_KEY;
//@ts-ignore
const genAI = new generative_ai_1.GoogleGenerativeAI(geminiKey);
// Access your API key as an environment variable (see "Set up your API key" above)
function recommendResponsibilities(profession, company, jobTitle, city, country) {
    return __awaiter(this, void 0, void 0, function* () {
        // For text-only input, use the gemini-1.5-pro-002 model
        // const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002"});
        // For text-only input, use the gemini-1.5-pro-002 model
        const prompt = `
  I am a ${jobTitle} and I worked at ${company}
  in ${city}, ${country}
  as a ${jobTitle} generate twenty(20) responsibilities
  I would have carried out in past tense.
  ${store.extraInstructions}
  `;
        const result = yield store.promptEngine(prompt);
        return result;
    });
}
exports.recommendResponsibilities = recommendResponsibilities;
function liberalPrompt(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        // For text-only input, use the gemini-1.5-pro-002 model
        const text = yield store.promptEngine(`${prompt} ${store.extraInstructions}`);
        return text;
    });
}
exports.liberalPrompt = liberalPrompt;
