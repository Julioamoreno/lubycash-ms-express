import express from 'express';
import clients from './src/routes/clients';
import Kafka from './src/Services/Kafka';
require('dotenv').config()

const app = express();
const PORT = 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

const kafka = new Kafka({ groupId: 'test' });

app.use('/client', clients)

app.get('/', async (_req,res) => {
  try {  
    await kafka.send({ topic: 'newuser', value: 'teste 1'});
    return res.send('ok');
  } catch (err) {
    return res.status(400).send(err)
  }
});

app.listen(PORT, () => {
  console.log(`Microsservice is running at https://localhost:${PORT}`);
});