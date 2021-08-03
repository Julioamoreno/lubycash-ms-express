"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const Database_1 = __importDefault(require("../Database"));
const Kafka_1 = __importDefault(require("../Services/Kafka"));
const CheckClientController_1 = __importDefault(require("./CheckClientController"));
const ClientsController = {
    list: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const client = yield Database_1.default('Clients').first();
            return res.json(client);
        }
        catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    }),
    store: (Client) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { full_name, email, phone, cpf_number, address, city, state, zipcode, average_salary } = Client;
            yield Database_1.default('Clients').insert({ full_name, email, phone, cpf_number, address, city, state, zipcode, average_salary });
            CheckClientController_1.default.store(Client);
            return express.response.send(`Cliente ${full_name} colocado na esteira de aprovação`);
        }
        catch (err) {
            console.log(err);
            return express.response.status(400).send(err);
        }
    }),
    update: (Client) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield Database_1.default('Clients').update(Client);
            const kafka = new Kafka_1.default({ groupId: 'client' });
            kafka.send({ topic: 'client_approved', value: JSON.stringify(Client) });
        }
        catch (err) {
            console.log(err);
            return express.response.status(400).send(err);
        }
    }),
    destroy: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = yield req.params.id;
    })
};
exports.default = ClientsController;
