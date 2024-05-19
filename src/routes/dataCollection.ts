import express from 'express';
import { experienceSection,headerSection, responsibilitiesSection } from '../controllers/dataCollection';
import auth from '../middleware/authentication';

const router = express.Router();
router.use(auth)


router.post('/header', headerSection);
router.post('/experiences', experienceSection);
router.post('/responsibilities', responsibilitiesSection);



export default router;
