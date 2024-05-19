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
router.post('/header', dataCollection_1.headerSection);
router.post('/experiences', dataCollection_1.experienceSection);
router.post('/responsibilities', dataCollection_1.responsibilitiesSection);
exports.default = router;
