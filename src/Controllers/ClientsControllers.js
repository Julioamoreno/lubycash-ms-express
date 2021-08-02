"use strict";
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
const Database_1 = __importDefault(require("../Database"));
const Kafka_1 = __importDefault(require("../Services/Kafka"));
const express_validator_1 = require("express-validator");
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
    store: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const errors = express_validator_1.validationResult(req);
            console.log(errors);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { full_name, email, phone, cpf_number, address, city, state, zipcode, average_salary } = req.body;
            yield Database_1.default('Clients').insert({ full_name, email, phone, cpf_number, address, city, state, zipcode, average_salary });
            const kafka = new Kafka_1.default({ groupId: 'kafkajs' });
            yield kafka.send({
                topic: 'clients',
                value: JSON.stringify({
                    full_name, email, phone, cpf_number, address, city, state, zipcode, average_salary
                })
            });
            return res.send('a');
        }
        catch (err) {
            console.log(err);
            return res.status(400).send(err);
        }
    }),
    destroy: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = yield req.params.id;
    })
};
exports.default = ClientsController;
