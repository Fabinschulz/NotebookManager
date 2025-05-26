import { InferType, object, string } from 'yup';

export const notebookSchema = object({
  userName: string()
    .required("O campo 'Nome e sobrenome' deve ser informado.")
    .typeError('O campo "Nome e sobrenome" é inválido.')
    .min(3, "O campo 'Nome e sobrenome' deve ter pelo menos 3 caracteres.")
    .max(100, "O campo 'Nome e sobrenome' deve ter no máximo 100 caracteres."),
  brand: string().required("O campo 'Marca' deve ser informado.").typeError('O campo "Marca" é inválido.'),
  processor: string()
    .required("O campo 'Processador' deve ser informado.")
    .typeError('O campo "Processador" é inválido.'),
  ram: string().required("O campo 'Memória RAM' deve ser informado.").typeError('O campo "Memória RAM" é inválido.'),
  storageType: string()
    .oneOf(['SSD', 'HDD'])
    .required("O campo 'Tipo de armazenamento' deve ser informado.")
    .typeError('O campo "Tipo de armazenamento" é inválido.'),
  storageCapacity: string()
    .required("O campo 'Capacidade de armazenamento' deve ser informado.")
    .typeError('O campo "Capacidade de armazenamento" é inválido.'),
  phoneNumber: string()
    .matches(/^\(?\d{2}\)?\s?\d{4,5}-\d{4}$/, 'Número de telefone inválido. Use o formato ou (XX) XXXXX-XXXX.')
    .required("O campo 'Telefone' deve ser informado.")
    .typeError('O campo "Telefone" é inválido.')
});

export type NotebookSchema = InferType<typeof notebookSchema>;

export const notebookSchemaDefaultValues: NotebookSchema = {
  userName: '',
  brand: '',
  processor: '',
  ram: '',
  storageType: 'SSD',
  storageCapacity: '',
  phoneNumber: ''
};
