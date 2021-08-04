import * as express from 'express';
import Clients from '../models/clients';
import ClientsController from './ClientsControllers';
import database from '../Database';
import KafkaConsumer from '../Services/Kafka';

const CheckClientsController = {
  store: async (id: number[], clientData: Clients) => {
    try {
      if (clientData.average_salary >= 501) {
        clientData.status = 'approved';
        clientData.current_balance = 200.00;
      } else {
        clientData.status = 'disapproved';
        clientData.current_balance = 0;
      }
      ClientsController.update(id, clientData)
    } catch (err) {
      throw new Error(err);
    }
  },
  show: async (clients: Clients) => {
    const client = await database('Clients')
      .where('cpf_number', clients.cpf_number)
      .orWhere('email', clients.email);
      
    const kafka = new KafkaConsumer({ groupId: 'sendClient' })
    return kafka.send({ topic: clients.cpf_number.toString(), value: JSON.stringify(client) });
  }

}

export default CheckClientsController;