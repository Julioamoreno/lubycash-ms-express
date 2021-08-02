import { Kafka, Consumer, Producer, Message } from 'kafkajs';

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

  async consume({ topic }: Topic) {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning: false });

    await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          await message
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
