import * as express from 'express';
import Clients from '../models/clients';
import ClientsController from './ClientsControllers';
import database from '../Database';
import KafkaConsumer from '../Services/Kafka';

const CheckClientsController = {
  store: async (ClientData: Clients) => {
    try {
      if (ClientData.average_salary >= 501) {
        ClientData.status = 'approved';
        ClientData.current_balance = 200.00;
      } else {
        ClientData.status = 'disapproved';
        ClientData.current_balance = 0;
      }
      ClientsController.update(ClientData)
    } catch (err) {
      throw new Error(err);
    }
  },
  show: async (clients: Clients) => {
    const client = await database('Clients')
      .where('cpf_number', clients.cpf_number)
      .orWhere('email', clients.email);
    console.log(client)
  
    const kafka = new KafkaConsumer({ groupId: 'sendClient' })
    return kafka.send({ topic: clients.cpf_number.toString(), value: JSON.stringify(client) });
  }

}

export default CheckClientsController;