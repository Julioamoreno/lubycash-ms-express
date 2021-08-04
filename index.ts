import express from 'express';
import clients from './src/routes/clients';
import KafkaConsumer from './src/Services/Kafka';
require('dotenv').config()

const app = express();
const PORT = 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
const run = async () => {
  app.listen(PORT, () => {
    console.log(`Microsservice is running at https://localhost:${PORT}`);
  });
}

app.use('/client', clients)

run();