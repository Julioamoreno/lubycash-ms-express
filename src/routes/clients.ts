import express from 'express';
import ClientsController from '../Controllers/ClientsControllers';
import ValidatorClients from '../validators/clients'
const Router = express.Router();

Router.get('/', ClientsController.list)

export default Router;