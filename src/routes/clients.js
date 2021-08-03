"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ClientsControllers_1 = __importDefault(require("../Controllers/ClientsControllers"));
const Router = express_1.default.Router();
Router.get('/', ClientsControllers_1.default.list);
exports.default = Router;
