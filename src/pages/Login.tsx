import { useState } from 'react';
import { useAppStore } from '../store';
import { UserType } from '../types';
import { User, Building } from 'lucide-react';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<UserType>('PF');
  const { setCurrentUser } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setCurrentUser({
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      type: userType,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">Finança</h1>
          <p className="text-gray-600">Gestão Financeira Inteligente</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Usuário
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('PF')}
                  className={`p-4 border-2 rounded-lg transition-colors duration-200 ${
                    userType === 'PF'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Pessoa Física</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setUserType('PJ')}
                  className={`p-4 border-2 rounded-lg transition-colors duration-200 ${
                    userType === 'PJ'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Building className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Pessoa Jurídica</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary"
            >
              Entrar no Sistema
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Demo: Clique em "Entrar no Sistema" para começar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 