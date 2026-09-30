import React, { useState, useEffect, useCallback } from 'react';
import { fetchAccount, executeTransfer } from './services/api';
import './App.css';

function App() {
  const [sourceId, setSourceId] = useState('ACC-100');
  const [destinationId, setDestinationId] = useState('ACC-200');
  const [amount, setAmount] = useState('');

  const [sourceAccount, setSourceAccount] = useState(null);
  const [destAccount, setDestAccount] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Função isolada para carregar as contas
  const loadAccountData = useCallback(async (srcId, dstId) => {
    if (!srcId.trim() || !dstId.trim()) return;

    setLoadingAccounts(true);
    setError(null);

    try {
      const [source, dest] = await Promise.all([
        fetchAccount(srcId),
        fetchAccount(dstId),
      ]);
      setSourceAccount(source);
      setDestAccount(dest);
    } catch (err) {
      setError(err.message || 'Erro ao carregar informações das contas.');
      setSourceAccount(null);
      setDestAccount(null);
    } finally {
      setLoadingAccounts(false);
    }
  }, []);

  // Debounce para evitar chamadas de API a cada tecla digitada
  useEffect(() => {
    const timer = setTimeout(() => {
      loadAccountData(sourceId, destinationId);
    }, 500);

    return () => clearTimeout(timer);
  }, [sourceId, destinationId, loadAccountData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações de Front-end
    if (sourceId === destinationId) {
      setError('A conta de origem e destino não podem ser iguais.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Informe um valor válido maior que zero.');
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    // Chave de idempotência segura usando a Web Crypto API
    const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `REQ-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const payload = {
      sourceAccountId: sourceId,
      destinationAccountId: destinationId,
      amount: numericAmount,
      idempotencyKey,
    };

    try {
      const response = await executeTransfer(payload);

      setMessage(response.message || 'Transferência realizada com sucesso!');
      setAmount('');

      // Atualiza o estado dos saldos com o retorno do backend ou recarrega os dados
      if (response.accounts) {
        setSourceAccount(response.accounts[sourceId]);
        setDestAccount(response.accounts[destinationId]);
      } else {
        await loadAccountData(sourceId, destinationId);
      }
    } catch (err) {
      setError(err.message || 'Falha ao processar a transferência.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>💸 Operações Financeiras em Tempo Real</h1>
        <p>Transferências seguras com validação de idempotência e concorrência</p>
      </header>

      {/* Painel de Exibição de Saldos */}
      <section className="accounts-grid">
        <div className="account-card source">
          <span className="badge">Origem</span>
          <h3>{loadingAccounts ? 'Carregando...' : sourceAccount?.ownerName || 'Conta não encontrada'}</h3>
          <p className="account-id">ID: {sourceId}</p>
          <div className="balance-box">
            <small>Saldo Disponível</small>
            <h2>
              R$ {sourceAccount?.balance !== undefined ? sourceAccount.balance.toFixed(2) : '0.00'}
            </h2>
          </div>
        </div>

        <div className="account-card destination">
          <span className="badge">Destino</span>
          <h3>{loadingAccounts ? 'Carregando...' : destAccount?.ownerName || 'Conta não encontrada'}</h3>
          <p className="account-id">ID: {destinationId}</p>
          <div className="balance-box">
            <small>Saldo Disponível</small>
            <h2>
              R$ {destAccount?.balance !== undefined ? destAccount.balance.toFixed(2) : '0.00'}
            </h2>
          </div>
        </div>
      </section>

      {/* Formulário de Transferência */}
      <section className="form-section">
        <form onSubmit={handleSubmit} className="transfer-form">
          <div className="form-group">
            <label htmlFor="sourceId">ID Conta Origem</label>
            <input
              id="sourceId"
              type="text"
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="destinationId">ID Conta Destino</label>
            <input
              id="destinationId"
              type="text"
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Valor da Transferência (R$)</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || loadingAccounts || !sourceAccount || !destAccount}
            className="submit-btn"
          >
            {loading ? 'Processando Transferência...' : 'Confirmar Transferência'}
          </button>
        </form>

        {/* Status e Feedbacks */}
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert danger">{error}</div>}
      </section>
    </div>
  );
}

export default App;