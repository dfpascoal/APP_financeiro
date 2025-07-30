import { useAppStore } from '../store';
import { formatCurrency, calculateMonthlyIncome, calculateMonthlyExpenses, calculateNetWorth } from '../utils';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard,
  Plus,
  Minus
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { transactions, accounts, categories, currentUser } = useAppStore();

  const monthlyIncome = calculateMonthlyIncome(transactions);
  const monthlyExpenses = calculateMonthlyExpenses(transactions);
  const monthlyBalance = monthlyIncome - monthlyExpenses;
  const netWorth = calculateNetWorth(accounts);

  // Recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

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
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Monthly trend data
  const monthlyTrend = [
    { name: 'Jan', income: 5000, expenses: 3200 },
    { name: 'Fev', income: 4800, expenses: 3400 },
    { name: 'Mar', income: 5200, expenses: 3100 },
    { name: 'Abr', income: 4900, expenses: 3300 },
    { name: 'Mai', income: 5100, expenses: 2900 },
    { name: 'Jun', income: 5300, expenses: 3500 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Bem-vindo de volta, {currentUser?.name}! Aqui está o resumo das suas finanças.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Patrimônio Líquido</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(netWorth)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Receita Mensal</p>
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
              <p className="text-sm font-medium text-gray-500">Despesas Mensais</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCard className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Saldo Mensal</p>
              <p className={`text-2xl font-bold ${monthlyBalance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {formatCurrency(monthlyBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendência Mensal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="income" fill="#22c55e" name="Receitas" />
              <Bar dataKey="expenses" fill="#ef4444" name="Despesas" />
            </BarChart>
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

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Transações Recentes</h3>
        </div>
        
        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-success-100' : 'bg-danger-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <Plus className="h-4 w-4 text-success-600" />
                    ) : (
                      <Minus className="h-4 w-4 text-danger-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{transaction.type}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma transação registrada ainda</p>
          </div>
        )}
      </div>
    </div>
  );
} 