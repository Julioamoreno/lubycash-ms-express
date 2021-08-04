import * as express from 'express';
import database from '../Database';
import { validationResult } from 'express-validator';

import Clients from '../models/clients';
import CheckClientsController from './CheckClientController';
import Kafka from '../Services/Kafka';

const ClientsController = {
  list: async (req: express.Request , res: express.Response) => {
    try {  
      const client = await database('Clients')
      return res.json(client);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
  store: async (req: express.Request , res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { full_name, email, phone, cpf_number, address, city, state, zipcode, average_salary }: Clients = req.body;
      const client = { full_name, email, phone, cpf_number, address, city, state, zipcode, average_salary };
      await database('Clients').insert(client).then((result) => {
        CheckClientsController.store(result, client);
        return res.json({ message: 'Dados enviados com sucesso, aguarde ao email com a resposta.' });
      }).catch((err) => res.status(400).send(err))
    } catch (err) {
      console.log(err);
      return res.status(400).send(err);
    }
  },
  update: async (id: number[], Client: Clients) => {
    try {
      await database('Clients')
        .update(Client)
        .where({ id })
        .then((result) => {
          console.log(result);
          const kafka = new Kafka({ groupId: 'sendClient' })
          if (Client.status === 'approved') {
            console.log('approved');
            kafka.send({ topic: 'client_approved', value: JSON.stringify({ ...Client, id }) })
          } else {
            kafka.send({ topic: 'client_disapproved', value: JSON.stringify({ ...Client, id }) })
          }
        }).catch((err) => {
          console.log(err);
        })
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