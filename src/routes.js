import { Router } from 'express';
import dealsController from './apps/controllers/DealsControllers'

const routes = new Router();

routes.get('/',dealsController.Index)


export default routes;
