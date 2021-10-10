import { createContext } from 'react';

const UserContext = createContext({
  nome: '',
  dataNasc: '',
  email: '',
});

export default UserContext;
