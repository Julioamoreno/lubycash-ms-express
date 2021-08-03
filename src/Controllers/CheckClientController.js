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
const ClientsControllers_1 = __importDefault(require("./ClientsControllers"));
const Database_1 = __importDefault(require("../Database"));
const Kafka_1 = __importDefault(require("../Services/Kafka"));
const CheckClientsController = {
    store: (ClientData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (ClientData.average_salary >= 501) {
                ClientData.status = 'approved';
                ClientData.current_balance = 200.00;
            }
            else {
                ClientData.status = 'disapproved';
                ClientData.current_balance = 0;
            }
            ClientsControllers_1.default.update(ClientData);
        }
        catch (err) {
            throw new Error(err);
        }
    }),
    show: (clients) => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield Database_1.default('Clients')
            .where('cpf_number', clients.cpf_number)
            .orWhere('email', clients.email);
        console.log(client);
        const kafka = new Kafka_1.default({ groupId: 'sendClient' });
        return kafka.send({ topic: clients.cpf_number.toString(), value: JSON.stringify(client) });
    })
};
exports.default = CheckClientsController;
