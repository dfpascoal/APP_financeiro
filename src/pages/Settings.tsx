import { useState } from 'react';
import { useAppStore } from '../store';
import { UserType } from '../types';
import { User, Building, Save, LogOut, Trash2 } from 'lucide-react';

export default function Settings() {
  const { currentUser, setCurrentUser } = useAppStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    type: currentUser?.type || 'PF' as UserType,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        name: formData.name.trim(),
        email: formData.email.trim(),
        type: formData.type,
        updatedAt: new Date(),
      });
      alert('Perfil atualizado com sucesso!');
    }
  };

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      setCurrentUser(null);
    }
  };

  const handleDeleteData = () => {
    if (confirm('Tem certeza que deseja excluir todos os dados? Esta ação não pode ser desfeita.')) {
      // Clear all data from localStorage
      localStorage.removeItem('financa-storage');
      // Reload the page to reset the application
      window.location.reload();
    }
  };

  const getTypeName = (type: UserType) => {
    return type === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie seu perfil e preferências</p>
      </div>

      {/* Profile Settings */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
            <User className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Perfil do Usuário</h2>
            <p className="text-sm text-gray-500">Atualize suas informações pessoais</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Usuário
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'PF' })}
                className={`p-4 border-2 rounded-lg transition-colors duration-200 ${
                  formData.type === 'PF'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Pessoa Física</span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'PJ' })}
                className={`p-4 border-2 rounded-lg transition-colors duration-200 ${
                  formData.type === 'PJ'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Pessoa Jurídica</span>
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="btn btn-primary">
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>

      {/* Account Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Conta</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">ID do Usuário</span>
            <span className="text-sm font-medium text-gray-900">{currentUser?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Tipo de Conta</span>
            <span className="text-sm font-medium text-gray-900">{getTypeName(currentUser?.type || 'PF')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Data de Criação</span>
            <span className="text-sm font-medium text-gray-900">
              {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('pt-BR') : '-'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Última Atualização</span>
            <span className="text-sm font-medium text-gray-900">
              {currentUser?.updatedAt ? new Date(currentUser.updatedAt).toLocaleDateString('pt-BR') : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair da Conta
          </button>
          
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-center px-4 py-2 border border-danger-300 rounded-lg text-danger-700 hover:bg-danger-50 transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir Todos os Dados
          </button>
        </div>
      </div>

      {/* App Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sobre o Aplicativo</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Versão</span>
            <span className="text-sm font-medium text-gray-900">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Desenvolvido por</span>
            <span className="text-sm font-medium text-gray-900">Finança Team</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Tecnologias</span>
            <span className="text-sm font-medium text-gray-900">React + TypeScript + Vite</span>
          </div>
        </div>
      </div>

      {/* Delete Data Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-100">
                <Trash2 className="h-5 w-5 text-danger-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Excluir Dados</h3>
                <p className="text-sm text-gray-500">Esta ação não pode ser desfeita</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir todos os dados do aplicativo? 
              Isso inclui transações, contas, categorias e orçamentos.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleDeleteData();
                  setShowDeleteModal(false);
                }}
                className="flex-1 btn btn-danger"
              >
                Excluir Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 