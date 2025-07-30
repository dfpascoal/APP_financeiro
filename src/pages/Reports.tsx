import { useState } from 'react';
import { useAppStore } from '../store';
import { formatCurrency, calculateMonthlyIncome, calculateMonthlyExpenses } from '../utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function Reports() {
  const { transactions, categories, accounts } = useAppStore();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const monthlyIncome = calculateMonthlyIncome(transactions);
  const monthlyExpenses = calculateMonthlyExpenses(transactions);
  const monthlyBalance = monthlyIncome - monthlyExpenses;

  // Category breakdown for expenses
  const categoryExpenses = categories
    .filter(cat => cat.type === 'expense')
    .map(cat => {
      const total = transactions
        .filter(t => t.categoryId === cat.id && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        name: cat.name,
        value: total,
        color: cat.color,
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  // Monthly trend data (demo data)
  const monthlyTrend = [
    { month: 'Jan', income: 5000, expenses: 3200, balance: 1800 },
    { month: 'Fev', income: 4800, expenses: 3400, balance: 1400 },
    { month: 'Mar', income: 5200, expenses: 3100, balance: 2100 },
    { month: 'Abr', income: 4900, expenses: 3300, balance: 1600 },
    { month: 'Mai', income: 5100, expenses: 2900, balance: 2200 },
    { month: 'Jun', income: 5300, expenses: 3500, balance: 1800 },
  ];

  // Account balances
  const accountBalances = accounts.map(account => ({
    name: account.name,
    balance: account.balance,
    type: account.type,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600">Análise detalhada das suas finanças</p>
      </div>

      {/* Period Selector */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="select max-w-xs"
          >
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="quarter">Último Trimestre</option>
            <option value="year">Último Ano</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Receitas</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyIncome)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingDown className="h-8 w-8 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Despesas</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Saldo</p>
              <p className={`text-2xl font-bold ${monthlyBalance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {formatCurrency(monthlyBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendência Mensal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Line type="monotone" dataKey="income" stroke="#22c55e" name="Receitas" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Despesas" strokeWidth={2} />
              <Line type="monotone" dataKey="balance" stroke="#3b82f6" name="Saldo" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Despesas por Categoria</h3>
          {categoryExpenses.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryExpenses}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryExpenses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>Nenhuma despesa registrada ainda</p>
            </div>
          )}
        </div>
      </div>

      {/* Account Balances Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Saldos por Conta</h3>
        {accountBalances.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accountBalances}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="balance" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>Nenhuma conta cadastrada ainda</p>
          </div>
        )}
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Principais Categorias</h3>
          <div className="space-y-3">
            {categoryExpenses.slice(0, 5).map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color || COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(category.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Account Summary */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo das Contas</h3>
          <div className="space-y-3">
            {accountBalances.map((account, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-primary-500" />
                  <span className="text-sm font-medium text-gray-900">{account.name}</span>
                </div>
                <span className={`text-sm font-semibold ${
                  account.balance >= 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {formatCurrency(account.balance)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 