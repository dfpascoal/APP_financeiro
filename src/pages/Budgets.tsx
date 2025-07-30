import { useState } from 'react';
import { useAppStore } from '../store';
import { formatCurrency } from '../utils';
import { Budget } from '../types';
import { Plus, Edit, Trash2, PieChart, AlertCircle } from 'lucide-react';

export default function Budgets() {
  const { budgets, categories, addBudget, updateBudget, deleteBudget } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    categoryId: '',
    period: 'monthly' as 'monthly' | 'yearly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount || !formData.categoryId) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (editingBudget) {
      updateBudget(editingBudget.id, {
        name: formData.name,
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId,
        period: formData.period,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      });
      setEditingBudget(null);
    } else {
      addBudget({
        name: formData.name,
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId,
        period: formData.period,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        spent: 0,
        userId: '1', // Demo user ID
      });
    }

    // Reset form
    setFormData({
      name: '',
      amount: '',
      categoryId: '',
      period: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    });
    setShowAddModal(false);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name,
      amount: budget.amount.toString(),
      categoryId: budget.categoryId,
      period: budget.period,
      startDate: new Date(budget.startDate).toISOString().split('T')[0],
      endDate: new Date(budget.endDate).toISOString().split('T')[0],
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      deleteBudget(id);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Categoria não encontrada';
  };

  const getProgressPercentage = (budget: Budget) => {
    return Math.min((budget.spent / budget.amount) * 100, 100);
  };

  const getProgressColor = (budget: Budget) => {
    const percentage = getProgressPercentage(budget);
    if (percentage >= 90) return 'bg-danger-500';
    if (percentage >= 75) return 'bg-warning-500';
    return 'bg-success-500';
  };

  const getPeriodName = (period: string) => {
    return period === 'monthly' ? 'Mensal' : 'Anual';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
          <p className="text-gray-600">Controle seus gastos com limites de orçamento</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Orçamento
        </button>
      </div>

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const percentage = getProgressPercentage(budget);
          const isOverBudget = budget.spent > budget.amount;
          
          return (
            <div key={budget.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{budget.name}</h3>
                  <p className="text-sm text-gray-500">{getCategoryName(budget.categoryId)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="text-danger-600 hover:text-danger-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Gasto</span>
                  <span className={`font-semibold ${isOverBudget ? 'text-danger-600' : 'text-gray-900'}`}>
                    {formatCurrency(budget.spent)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Limite</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(budget.amount)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Restante</span>
                  <span className={`font-semibold ${
                    budget.amount - budget.spent >= 0 ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {formatCurrency(budget.amount - budget.spent)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(budget)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{percentage.toFixed(1)}% utilizado</span>
                  <span>{getPeriodName(budget.period)}</span>
                </div>

                {isOverBudget && (
                  <div className="flex items-center space-x-2 text-danger-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Orçamento excedido!</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="card text-center py-12">
          <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum orçamento configurado</h3>
          <p className="text-gray-500 mb-4">
            Crie orçamentos para controlar seus gastos por categoria.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Orçamento
          </button>
        </div>
      )}

      {/* Add/Edit Budget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Orçamento *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="Ex: Orçamento Alimentação"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Limite *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input"
                  placeholder="0,00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="select"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories
                    .filter(cat => cat.type === 'expense')
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Período
                </label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value as 'monthly' | 'yearly' })}
                  className="select"
                >
                  <option value="monthly">Mensal</option>
                  <option value="yearly">Anual</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Início
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Fim
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingBudget(null);
                  }}
                  className="flex-1 btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn btn-primary"
                >
                  {editingBudget ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 