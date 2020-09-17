import { Router } from 'express';
import dealsController from './apps/controllers/DealsControllers'

const routes = new Router();

routes.get('/report-per-day/', dealsController.reportPerDay)
routes.get('/',dealsController.Index)


export default routes;
