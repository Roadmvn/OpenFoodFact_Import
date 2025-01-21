const { Order, Product, User } = require('../models');
const { Op } = require('sequelize');
const { localPool } = require('../config/database');

exports.getDashboardData = async (req, res) => {
  try {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Statistiques générales
    const stats = await Promise.all([
      // Ventes du jour
      localPool.execute(`
        SELECT SUM(total_amount) as daily_sales
        FROM orders
        WHERE DATE(created_at) = CURDATE()
      `),

      // Nombre de commandes du jour
      localPool.execute(`
        SELECT COUNT(*) as order_count
        FROM orders
        WHERE DATE(created_at) = CURDATE()
      `),

      // Clients actifs du mois
      localPool.execute(`
        SELECT COUNT(DISTINCT user_id) as active_users
        FROM orders
        WHERE created_at BETWEEN ? AND ?
      `, [firstDayOfMonth, lastDayOfMonth]),

      // Panier moyen
      localPool.execute(`
        SELECT AVG(total_amount) as avg_basket
        FROM orders
        WHERE created_at BETWEEN ? AND ?
      `, [firstDayOfMonth, lastDayOfMonth])
    ]);

    // Tendances par rapport au mois dernier
    const trends = await Promise.all([
      // Tendance des ventes
      localPool.execute(`
        SELECT 
          (
            (
              SELECT SUM(total_amount)
              FROM orders
              WHERE created_at BETWEEN ? AND ?
            ) - (
              SELECT SUM(total_amount)
              FROM orders
              WHERE created_at BETWEEN ? AND ?
            )
          ) / (
            SELECT SUM(total_amount)
            FROM orders
            WHERE created_at BETWEEN ? AND ?
          ) * 100 as sales_trend
      `, [firstDayOfMonth, lastDayOfMonth, lastMonth, firstDayOfMonth, lastMonth, firstDayOfMonth])
    ]);

    // Données des ventes sur 7 jours
    const [salesData] = await localPool.execute(`
      SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as total
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Produits les plus vendus
    const [topProducts] = await localPool.execute(`
      SELECT 
        p.name,
        COUNT(oi.product_id) as sales_count,
        SUM(oi.quantity) as total_quantity
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.created_at BETWEEN ? AND ?
      GROUP BY oi.product_id
      ORDER BY sales_count DESC
      LIMIT 5
    `, [firstDayOfMonth, lastDayOfMonth]);

    // Dernières commandes
    const [recentOrders] = await localPool.execute(`
      SELECT 
        o.id,
        o.total_amount,
        o.status,
        o.created_at,
        u.name as customer_name
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    // Formater les statistiques
    const [dailySales, orderCount, activeUsers, avgBasket] = stats;
    const [salesTrend] = trends;

    const formattedStats = [
      {
        title: 'Ventes du jour',
        value: `${dailySales[0].daily_sales || 0} €`,
        trend: parseFloat(salesTrend[0].sales_trend || 0)
      },
      {
        title: 'Commandes',
        value: orderCount[0].order_count || 0,
        trend: 0 // À calculer si nécessaire
      },
      {
        title: 'Clients actifs',
        value: activeUsers[0].active_users || 0,
        trend: 0 // À calculer si nécessaire
      },
      {
        title: 'Panier moyen',
        value: `${(avgBasket[0].avg_basket || 0).toFixed(2)} €`,
        trend: 0 // À calculer si nécessaire
      }
    ];

    res.json({
      success: true,
      data: {
        stats: formattedStats,
        salesData: salesData.map(day => ({
          date: day.date,
          total: parseFloat(day.total)
        })),
        topProducts: topProducts.map(product => ({
          name: product.name,
          sales: parseInt(product.sales_count),
          quantity: parseInt(product.total_quantity)
        })),
        recentOrders: recentOrders.map(order => ({
          id: order.id,
          customer: order.customer_name,
          date: order.created_at,
          total: parseFloat(order.total_amount),
          status: order.status
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des données du tableau de bord'
    });
  }
};
