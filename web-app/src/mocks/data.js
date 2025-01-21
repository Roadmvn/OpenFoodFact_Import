export const mockUsers = [
  {
    id: 1,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  }
]

export const mockProducts = [
  {
    id: 1,
    name: 'Ordinateur Portable',
    price: 999.99,
    stock: 50,
    category: 'Électronique'
  },
  {
    id: 2,
    name: 'Smartphone',
    price: 699.99,
    stock: 100,
    category: 'Électronique'
  },
  {
    id: 3,
    name: 'Casque Audio',
    price: 149.99,
    stock: 75,
    category: 'Électronique'
  }
]

export const mockTransactions = [
  {
    id: 1,
    date: '2025-01-13T10:30:00',
    type: 'sale',
    amount: 999.99,
    status: 'completed'
  },
  {
    id: 2,
    date: '2025-01-13T11:15:00',
    type: 'purchase',
    amount: 1499.99,
    status: 'pending'
  },
  {
    id: 3,
    date: '2025-01-13T12:00:00',
    type: 'refund',
    amount: 149.99,
    status: 'completed'
  }
]

export const mockStatistics = {
  products: {
    total: 150,
    outOfStock: 5,
    lowStock: 10,
    totalValue: 75000,
    changes: {
      daily: 5,
      weekly: 12,
      monthly: 25
    }
  },
  users: {
    total: 50,
    active: 35,
    newThisMonth: 10,
    changes: {
      daily: 2,
      weekly: 8,
      monthly: 15
    }
  },
  sales: {
    total: 25000,
    daily: 1200,
    weekly: 8500,
    monthly: 25000,
    changes: {
      daily: 8,
      weekly: 15,
      monthly: 20
    }
  },
  transactions: {
    total: 75,
    completed: 60,
    pending: 10,
    failed: 5,
    changes: {
      daily: 10,
      weekly: 25,
      monthly: 50
    }
  }
}

export const mockChartData = {
  revenue: [
    { date: '2025-01-07', value: 5000 },
    { date: '2025-01-08', value: 6200 },
    { date: '2025-01-09', value: 7400 },
    { date: '2025-01-10', value: 5900 },
    { date: '2025-01-11', value: 8100 },
    { date: '2025-01-12', value: 9300 },
    { date: '2025-01-13', value: 7800 }
  ],
  topProducts: [
    { name: 'Ordinateur Portable', sales: 50 },
    { name: 'Smartphone', sales: 45 },
    { name: 'Casque Audio', sales: 30 },
    { name: 'Tablette', sales: 25 },
    { name: 'Écran', sales: 20 }
  ]
}

export const mockInvoices = [
  {
    id: 'INV-2025-001',
    clientName: 'Entreprise ABC',
    date: '2025-01-13',
    amount: 1299.99,
    status: 'payée',
    items: [
      { name: 'Ordinateur Portable', quantity: 1, price: 999.99 },
      { name: 'Souris Sans Fil', quantity: 2, price: 150.00 }
    ]
  },
  {
    id: 'INV-2025-002',
    clientName: 'Société XYZ',
    date: '2025-01-12',
    amount: 2499.99,
    status: 'en_attente',
    items: [
      { name: 'Smartphone', quantity: 3, price: 699.99 },
      { name: 'Coque Protection', quantity: 3, price: 133.34 }
    ]
  },
  {
    id: 'INV-2025-003',
    clientName: 'Tech Solutions',
    date: '2025-01-11',
    amount: 899.97,
    status: 'payée',
    items: [
      { name: 'Casque Audio', quantity: 6, price: 149.99 }
    ]
  },
  {
    id: 'INV-2025-004',
    clientName: 'Digital Services',
    date: '2025-01-10',
    amount: 1599.96,
    status: 'annulée',
    items: [
      { name: 'Tablette', quantity: 2, price: 799.98 }
    ]
  },
  {
    id: 'INV-2025-005',
    clientName: 'Innovation Corp',
    date: '2025-01-09',
    amount: 3299.95,
    status: 'en_attente',
    items: [
      { name: 'Écran 4K', quantity: 5, price: 659.99 }
    ]
  }
]
