import { useState } from 'react';
import { useAppStore } from '../store';
import { formatCurrency } from '../utils';
import { Account } from '../types';
import { Plus, Edit, Trash2, Wallet, CreditCard, PiggyBank, TrendingUp, DollarSign } from 'lucide-react';

export default function Accounts() {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'checking' as Account['type'],
    balance: '',
    currency: 'BRL',
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.balance) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (editingAccount) {
      updateAccount(editingAccount.id, {
        name: formData.name,
        type: formData.type,
        balance: parseFloat(formData.balance),
        currency: formData.currency,
        isActive: formData.isActive,
      });
      setEditingAccount(null);
    } else {
      addAccount({
        name: formData.name,
        type: formData.type,
        balance: parseFloat(formData.balance),
        currency: formData.currency,
        isActive: formData.isActive,
        userId: '1', // Demo user ID
      });
    }

    // Reset form
    setFormData({
      name: '',
      type: 'checking',
      balance: '',
      currency: 'BRL',
      isActive: true,
    });
    setShowAddModal(false);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      currency: account.currency,
      isActive: account.isActive,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
      deleteAccount(id);
    }
  };

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return <Wallet className="h-6 w-6" />;
      case 'savings':
        return <PiggyBank className="h-6 w-6" />;
      case 'credit':
        return <CreditCard className="h-6 w-6" />;
      case 'investment':
        return <TrendingUp className="h-6 w-6" />;
      case 'cash':
        return <DollarSign className="h-6 w-6" />;
      default:
        return <Wallet className="h-6 w-6" />;
    }
  };

  const getAccountTypeName = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return 'Conta Corrente';
      case 'savings':
        return 'Conta Poupança';
      case 'credit':
        return 'Cartão de Crédito';
      case 'investment':
        return 'Investimento';
      case 'cash':
        return 'Dinheiro';
      default:
        return 'Conta';
    }
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contas</h1>
          <p className="text-gray-600">Gerencie suas contas bancárias e saldos</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </button>
      </div>

      {/* Total Balance */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Saldo Total</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{accounts.length} contas</p>
          </div>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div key={account.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full ${
                  account.isActive ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {getAccountIcon(account.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
                  <p className="text-sm text-gray-500">{getAccountTypeName(account.type)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(account)}
                  className="text-primary-600 hover:text-primary-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(account.id)}
                  className="text-danger-600 hover:text-danger-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Saldo</span>
                <span className={`text-lg font-bold ${
                  account.balance >= 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {formatCurrency(account.balance)}
                </span>
              </div>
              
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-400">Status</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  account.isActive 
                    ? 'bg-success-100 text-success-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {account.isActive ? 'Ativa' : 'Inativa'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="card text-center py-12">
          <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma conta cadastrada</h3>
          <p className="text-gray-500 mb-4">
            Comece adicionando suas contas bancárias para gerenciar seus saldos.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeira Conta
          </button>
        </div>
      )}

      {/* Add/Edit Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingAccount ? 'Editar Conta' : 'Nova Conta'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Conta *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="Ex: Conta Principal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Conta *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Account['type'] })}
                  className="select"
                  required
                >
                  <option value="checking">Conta Corrente</option>
                  <option value="savings">Conta Poupança</option>
                  <option value="credit">Cartão de Crédito</option>
                  <option value="investment">Investimento</option>
                  <option value="cash">Dinheiro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Saldo Inicial *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  className="input"
                  placeholder="0,00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Moeda
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="select"
                >
                  <option value="BRL">Real (BRL)</option>
                  <option value="USD">Dólar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Conta ativa
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingAccount(null);
                  }}
                  className="flex-1 btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn btn-primary"
                >
                  {editingAccount ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 