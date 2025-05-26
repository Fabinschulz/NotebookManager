import { db, notebooks } from '@/drizzle';
import { createNotebook } from './actions';

export default async function NotebooksPage() {
  const data = await db.select().from(notebooks).orderBy(notebooks.createdAt);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Notebooks</h1>

      <form
        action={async (formData) => {
          'use server';
          const data = {
            userName: formData.get('userName') as string,
            brand: formData.get('brand') as string,
            ram: formData.get('ram') as string,
            processor: formData.get('processor') as string,
            storageType: formData.get('storageType') as string,
            storageSize: formData.get('storageSize') as string,
            phoneNumber: formData.get('phoneNumber') as string,
          };
          await createNotebook(data);
        }}
        className="space-y-2 mb-6"
      >
        <input name="userName" placeholder="Nome" className="border p-2 w-full" required />
        <input name="brand" placeholder="Marca" className="border p-2 w-full" required />
        <input name="ram" placeholder="Memória RAM" className="border p-2 w-full" required />
        <input name="processor" placeholder="Processador" className="border p-2 w-full" required />
        <input name="storageType" placeholder="Tipo (SSD ou HDD)" className="border p-2 w-full" required />
        <input name="storageSize" placeholder="Tamanho (Ex.: 512GB)" className="border p-2 w-full" required />
        <input name="phoneNumber" placeholder="Telefone" className="border p-2 w-full" required />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Adicionar Notebook
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Nome</th>
            <th className="p-2">Marca</th>
            <th className="p-2">RAM</th>
            <th className="p-2">Processador</th>
            <th className="p-2">Armazenamento</th>
            <th className="p-2">Telefone</th>
          </tr>
        </thead>
        <tbody>
          {data.map((nb) => (
            <tr key={nb.id} className="border-t">
              <td className="p-2">{nb.userName}</td>
              <td className="p-2">{nb.brand}</td>
              <td className="p-2">{nb.ram}</td>
              <td className="p-2">{nb.processor}</td>
              <td className="p-2">
                {nb.storageType} - {nb.storageSize}
              </td>
              <td className="p-2">{nb.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
