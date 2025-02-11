import { Router } from 'express';
import {identifyUser} from '../controllers/identifyController';

export const identifyRouter = Router();
identifyRouter.post('/', identifyUser);