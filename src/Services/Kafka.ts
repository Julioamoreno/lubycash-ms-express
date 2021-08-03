import { Kafka, Consumer, Producer, Message } from 'kafkajs';
import ClientsControllers from '../Controllers/ClientsControllers';
import CheckClientController from '../Controllers/CheckClientController';
import Client from '../models/clients';

interface Topic {
  topic: string | RegExp;
}

interface ConsumerConfig {
  groupId: string;
}

interface SendParams {
  topic: string;
  value: Message["value"];
}

export default class KafkaConsumer {
  public consumer: Consumer;
  public producer: Producer;

  constructor({ groupId }: ConsumerConfig) {
    const kafka = new Kafka({
        brokers: ['kafkaservice:9092']
    })
    this.producer = kafka.producer()
    this.consumer = kafka.consumer({ groupId })
  }

  async consumeNewClient() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'newclient', fromBeginning: false });

    await this.consumer.run({
        eachMessage: async ({ message }) => {
          const client: Client = JSON.parse(message.value!.toString());
          await ClientsControllers.store(client)
        }   
    })
  }

  async checkAvailable() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'checkClientAvailable', fromBeginning: false });

    await this.consumer.run({
        eachMessage: async ({ message }) => {
          const client: Client = JSON.parse(message.value!.toString());
          return await CheckClientController.show(client)
        }   
    })
  }

  async send({ topic, value }: SendParams) {
    await this.producer.connect();
    await this.producer.send({
        topic,
        messages: [
            {
              value,
            }
          
        ]
      });
      await this.producer.disconnect();
  }
}
