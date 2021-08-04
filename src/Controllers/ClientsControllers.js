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
const express_validator_1 = require("express-validator");
const CheckClientController_1 = __importDefault(require("./CheckClientController"));
const Kafka_1 = __importDefault(require("../Services/Kafka"));
const ClientsController = {
    list: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const client = yield Database_1.default('Clients');
            return res.json(client);
        }
        catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    }),
    store: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const errors = express_validator_1.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { full_name, email, phone, cpf_number, address, city, state, zipcode, average_salary } = req.body;
            const client = { full_name, email, phone, cpf_number, address, city, state, zipcode, average_salary };
            yield Database_1.default('Clients').insert(client).then((result) => {
                CheckClientController_1.default.store(result, client);
                return res.json({ message: 'Dados enviados com sucesso, aguarde ao email com a resposta.' });
            }).catch((err) => res.status(400).send(err));
        }
        catch (err) {
            console.log(err);
            return res.status(400).send(err);
        }
    }),
    update: (id, Client) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield Database_1.default('Clients')
                .update(Client)
                .where({ id })
                .then((result) => {
                console.log(result);
                const kafka = new Kafka_1.default({ groupId: 'sendClient' });
                if (Client.status === 'approved') {
                    console.log('approved');
                    kafka.send({ topic: 'client_approved', value: JSON.stringify(Object.assign(Object.assign({}, Client), { id })) });
                }
                else {
                    kafka.send({ topic: 'client_disapproved', value: JSON.stringify(Object.assign(Object.assign({}, Client), { id })) });
                }
            }).catch((err) => {
                console.log(err);
            });
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
