import express from 'express';
import { 
    experienceSection,
    headerSection, 
    responsibilitiesSection,
    educationSection,
    liberalPrompting
 } from '../controllers/dataCollection';
import auth from '../middleware/authentication';

const router = express.Router();
router.use(auth)


router.post('/header', headerSection);
router.post('/experiences', experienceSection);
router.post('/responsibilities', responsibilitiesSection);
router.post('/education', educationSection);
router.post('/liberal', liberalPrompting);


export default router;
