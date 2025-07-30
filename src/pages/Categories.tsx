import { useState } from 'react';
import { useAppStore } from '../store';
import { Category, TransactionType } from '../types';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    color: '#6B7280',
    icon: '🏷️',
    type: 'expense' as TransactionType,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      alert('Por favor, preencha o nome da categoria.');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formData.name,
        color: formData.color,
        icon: formData.icon,
        type: formData.type,
      });
      setEditingCategory(null);
    } else {
      addCategory({
        name: formData.name,
        color: formData.color,
        icon: formData.icon,
        type: formData.type,
        userId: '1', // Demo user ID
      });
    }

    // Reset form
    setFormData({
      name: '',
      color: '#6B7280',
      icon: '🏷️',
      type: 'expense',
    });
    setShowAddModal(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon,
      type: category.type,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      deleteCategory(id);
    }
  };

  const getTypeName = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return 'Receita';
      case 'expense':
        return 'Despesa';
      case 'transfer':
        return 'Transferência';
      default:
        return 'Geral';
    }
  };

  const colorOptions = [
    '#6B7280', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#8B5CF6', '#EC4899', '#F97316', '#84CC16', '#06B6D4'
  ];

  const iconOptions = [
    '🏷️', '💰', '💸', '🛒', '🍽️', '🚗', '🏠', '💊', '🎓', '🎬',
    '🏋️', '✈️', '🎮', '📱', '💻', '👕', '💄', '🎁', '💡', '🔧'
  ];

  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const transferCategories = categories.filter(cat => cat.type === 'transfer');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600">Organize suas transações com categorias personalizadas</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </button>
      </div>

      {/* Categories by Type */}
      <div className="space-y-8">
        {/* Expense Categories */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Despesas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenseCategories.map((category) => (
              <div key={category.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="p-3 rounded-full"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <span className="text-xl">{category.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{getTypeName(category.type)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-danger-600 hover:text-danger-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Income Categories */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Receitas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomeCategories.map((category) => (
              <div key={category.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="p-3 rounded-full"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <span className="text-xl">{category.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{getTypeName(category.type)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-danger-600 hover:text-danger-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transfer Categories */}
        {transferCategories.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Transferências</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transferCategories.map((category) => (
                <div key={category.id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="p-3 rounded-full"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <span className="text-xl">{category.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">{getTypeName(category.type)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-danger-600 hover:text-danger-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {categories.length === 0 && (
        <div className="card text-center py-12">
          <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma categoria cadastrada</h3>
          <p className="text-gray-500 mb-4">
            Crie categorias para organizar melhor suas transações.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeira Categoria
          </button>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="Ex: Alimentação"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
                  className="select"
                  required
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                  <option value="transfer">Transferência</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ícone
                </label>
                <div className="grid grid-cols-10 gap-2">
                  {iconOptions.map((icon, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`p-2 rounded border-2 text-lg ${
                        formData.icon === icon 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map((color, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color 
                          ? 'border-gray-900' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
                  }}
                  className="flex-1 btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn btn-primary"
                >
                  {editingCategory ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 