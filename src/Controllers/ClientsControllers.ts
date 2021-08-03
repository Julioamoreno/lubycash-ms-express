import * as express from 'express';
import database from '../Database';
import Kafka from '../Services/Kafka';
import { validationResult } from 'express-validator';

import Clients from '../models/clients';
import CheckClientsController from './CheckClientController';

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
  store: async (Client: Clients) => {
    try {
      const { full_name, email, phone, cpf_number, address, city, state, zipcode, average_salary } = Client;
      await database('Clients').insert({ full_name, email, phone, cpf_number, address, city, state, zipcode, average_salary });
      CheckClientsController.store(Client);
      return express.response.send(`Cliente ${full_name} colocado na esteira de aprovação`)
    } catch (err) {
      console.log(err);
      return express.response.status(400).send(err);
    }
  },
  update: async (Client: Clients) => {
    try {
      await database('Clients').update(Client)
      const kafka = new Kafka({ groupId: 'client' })
      kafka.send({ topic: 'client_approved', value: JSON.stringify(Client) })
    } catch (err) {
      console.log(err);
      return express.response.status(400).send(err);
    }
  },
  destroy: async (req: express.Request , res: express.Response) => {
    const id = await req.params.id;
  }
}

export default ClientsController;