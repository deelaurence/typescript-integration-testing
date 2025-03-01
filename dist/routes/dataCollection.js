"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dataCollection_1 = require("../controllers/dataCollection");
const authentication_1 = __importDefault(require("../middleware/authentication"));
const router = express_1.default.Router();
router.use(authentication_1.default);
router.post('/initialize', dataCollection_1.initializeResume);
router.post('/header', dataCollection_1.headerSection);
router.post('/experiences', dataCollection_1.experienceSection);
router.post('/responsibilities', dataCollection_1.responsibilitiesSection);
router.post('/education', dataCollection_1.educationSection);
router.post('/core/:state', dataCollection_1.skillsAndToolsSection);
router.put('/select-template', dataCollection_1.selectTemplate);
router.put('/set-completed', dataCollection_1.setCompletedState);
router.post('/get/core/:state', dataCollection_1.PromtskillsAndTools);
router.post('/get/career-summary', dataCollection_1.promptCareerSummary);
router.post('/career-summary', dataCollection_1.careerSummarySection);
router.post('/liberal', dataCollection_1.liberalPrompting);
exports.default = router;
