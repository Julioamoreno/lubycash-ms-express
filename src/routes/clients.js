"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ClientsControllers_1 = __importDefault(require("../Controllers/ClientsControllers"));
const clients_1 = __importDefault(require("../validators/clients"));
const Router = express_1.default.Router();
Router.get('/', ClientsControllers_1.default.list);
Router.post('/new', clients_1.default, ClientsControllers_1.default.store);
exports.default = Router;
