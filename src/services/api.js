const API_BASE_URL = 'http://localhost:8085/api';

export const fetchAccount = async (id) => {
  const response = await fetch(`${API_BASE_URL}/accounts/${id}`);
  if (!response.ok) {
    throw new Error(`Erro ao buscar a conta ${id}`);
  }
  return await response.json();
};

export const executeTransfer = async (transferData) => {
  const response = await fetch(`${API_BASE_URL}/transfer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transferData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Ocorreu um erro ao processar a transferência.');
  }

  return data;
};