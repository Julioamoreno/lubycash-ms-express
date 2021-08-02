import * as express from 'express';
import database from '../Database';
import Kafka from '../Services/Kafka';
import { validationResult } from 'express-validator';

import Clients from '../models/clients';

const ClientsController = {
  list: async (req: express.Request , res: express.Response) => {
    try {  
      const client = await database('Clients').first();
      return res.json(client);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
  store: async (req: express.Request , res: express.Response) => {
    try {
      const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { full_name, email, phone, cpf_number, address, city, state, zipcode, average_salary }: Clients = req.body;
      await database('Clients').insert({ full_name, email, phone, cpf_number, address, city, state, zipcode, average_salary });
      const kafka = new Kafka({ groupId: 'kafkajs' });
      await kafka.send({
        topic: 'clients',
        value: 
          JSON.stringify(
            { 
              full_name, email, phone, cpf_number, address, city, state, zipcode, average_salary 
            }
          )
      });
      return res.send('a')
    } catch (err) {
      console.log(err);
      return res.status(400).send(err)
    }
  },
  destroy: async (req: express.Request , res: express.Response) => {
    const id = await req.params.id;
  }
}

export default ClientsController;