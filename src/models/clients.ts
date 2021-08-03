export default interface Clients {
  full_name: string;
  email: string; 
  phone: string;
  cpf_number: string; 
  address: string;
  city: string;
  state: string;
  zipcode: string;
  status?: string;
  average_salary: number;
  current_balance?: number;
} 