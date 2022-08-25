import { Router } from 'express';

import { getController } from '../common/controller';
import * as compliantService from './compliance.service';

const complianceController = Router();
const complianceSummaryController = Router();

complianceSummaryController.get('/', getController(compliantService.getCount));

complianceController.get('/', getController(compliantService.getAll));

complianceController.use('/summary', complianceSummaryController);

export default complianceController;
