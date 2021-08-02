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
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
class KafkaConsumer {
    constructor({ groupId }) {
        const kafka = new kafkajs_1.Kafka({
            brokers: ['kafkaservice:9092']
        });
        this.producer = kafka.producer();
        this.consumer = kafka.consumer({ groupId });
    }
    consume({ topic }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.consumer.connect();
            yield this.consumer.subscribe({ topic, fromBeginning: false });
            yield this.consumer.run({
                eachMessage: ({ topic, partition, message }) => __awaiter(this, void 0, void 0, function* () {
                    yield message;
                })
            });
        });
    }
    send({ topic, value }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.connect();
            yield this.producer.send({
                topic,
                messages: [
                    {
                        value,
                    }
                ]
            });
            yield this.producer.disconnect();
        });
    }
}
exports.default = KafkaConsumer;
