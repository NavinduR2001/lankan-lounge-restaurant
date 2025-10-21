// Create: frontend/src/components/charts/ItemSummary.jsx
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { getOrderHistory, getAllItems } from '../../services/api';
import '../chart/Chart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ItemSummary = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [categoryItemStats, setCategoryItemStats] = useState([]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'sri-lankan', label: 'Sri Lankan Food' },
    { value: 'indian', label: 'Indian Food' },
    { value: 'chinese', label: 'Chinese Food' },
    { value: 'family-meals', label: 'Family Meals' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'bakery', label: 'Bakery Items' },
    { value: 'pizza', label: 'Pizza' },
    { value: 'beverages', label: 'Beverages' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (orderHistory.length > 0 && items.length > 0) {
      processItemData();
    }
  }, [orderHistory, items, selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [historyResponse, itemsResponse] = await Promise.all([
        getOrderHistory({ limit: 1000 }),
        getAllItems()
      ]);
      
      if (historyResponse.data.success) {
        setOrderHistory(historyResponse.data.data.records);
      }
      
      if (itemsResponse.data.items) {
        setItems(itemsResponse.data.items);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getItemCategory = (itemName) => {
    const item = items.find(i => i.itemName.toLowerCase() === itemName.toLowerCase());
    return item ? item.itemCategory : 'other';
  };

  const processItemData = () => {
    // Process all sold items
    const itemSales = {};
    const categorySales = {};

    orderHistory.forEach(order => {
      order.items.forEach(item => {
        const category = getItemCategory(item.name);
        
        // Track item sales
        if (!itemSales[item.name]) {
          itemSales[item.name] = {
            name: item.name,
            category: category,
            totalQuantity: 0,
            totalRevenue: 0,
            orderCount: 0
          };
        }
        
        itemSales[item.name].totalQuantity += item.quantity;
        itemSales[item.name].totalRevenue += item.price * item.quantity;
        itemSales[item.name].orderCount++;

        // Track category sales
        if (!categorySales[category]) {
          categorySales[category] = {
            category: category,
            totalOrders: 0,
            totalRevenue: 0,
            totalQuantity: 0
          };
        }
        
        categorySales[category].totalOrders++;
        categorySales[category].totalRevenue += item.price * item.quantity;
        categorySales[category].totalQuantity += item.quantity;
      });
    });

    // Get top selling items
    const topItems = Object.values(itemSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10);
    
    setTopSellingItems(topItems);

    // Get category stats
    const categoryStatsArray = Object.values(categorySales)
      .sort((a, b) => b.totalOrders - a.totalOrders);
    
    setCategoryStats(categoryStatsArray);

    // Get items by selected category
    if (selectedCategory !== 'all') {
      const categoryItems = Object.values(itemSales)
        .filter(item => item.category === selectedCategory)
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 10);
      
      setCategoryItemStats(categoryItems);
    } else {
      setCategoryItemStats(topItems);
    }
  };

  // Chart configurations
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  // Top selling items chart data
  const topItemsChartData = {
    labels: topSellingItems.map(item => item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name),
    datasets: [
      {
        label: 'Quantity Sold',
        data: topSellingItems.map(item => item.totalQuantity),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 205, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(199, 199, 199, 0.5)',
          'rgba(83, 102, 255, 0.5)',
          'rgba(255, 99, 255, 0.5)',
          'rgba(99, 255, 132, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(255, 99, 255, 1)',
          'rgba(99, 255, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Category pie chart data
  const categoryPieData = {
    labels: categoryStats.map(cat => cat.category.charAt(0).toUpperCase() + cat.category.slice(1)),
    datasets: [
      {
        label: 'Orders by Category',
        data: categoryStats.map(cat => cat.totalOrders),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
          'rgba(255, 99, 255, 0.8)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Category items chart data
  const categoryItemsChartData = {
    labels: categoryItemStats.map(item => item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name),
    datasets: [
      {
        label: 'Quantity Sold',
        data: categoryItemStats.map(item => item.totalQuantity),
        backgroundColor: '#ffca28',
        borderColor: '#ffae00ff',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <div className="loading">Loading item data...</div>;
  }

  return (
    <div className="item-summary">
      {/* Top Selling Items Table */}
      <div className="top-items-section">
        <h3>Top Selling Items</h3>
        <div className="table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity Sold</th>
                <th>Total Revenue</th>
                <th>Orders Count</th>
              </tr>
            </thead>
            <tbody>
              {topSellingItems.map((item, index) => (
                <tr key={item.name}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.totalQuantity}</td>
                  <td>LKR {item.totalRevenue.toLocaleString()}</td>
                  <td>{item.orderCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Category Filter Section */}
      <div className="category-filter-section">
        <div className="category-selector">
          <h3>Items by Category</h3>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="chart-card top-items-category-chart">
          <h3>
            {selectedCategory === 'all' ? 'Top Items (All Categories)' : 
             `Top Items - ${categories.find(c => c.value === selectedCategory)?.label}`}
          </h3>
          <Bar data={categoryItemsChartData} options={chartOptions} />
        </div>
      </div>
      

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Top Items Bar Chart */}
        <div className="chart-card">
          <h3>Top 10 Selling Items</h3>
          <Bar data={topItemsChartData} options={chartOptions} />
        </div>

        {/* Category Pie Chart */}
        <div className="chart-card pie-chart-card">
          <h3>Orders by Category</h3>
          <Pie className="pie-chart" data={categoryPieData} options={pieOptions} />
        </div>
      </div>



      {/* Category Stats Table */}
      <div className="category-stats-section">
        <h3>Category Performance</h3>
        <div className="table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Orders</th>
                <th>Total Quantity</th>
                <th>Total Revenue</th>
                <th>Average Order Value</th>
              </tr>
            </thead>
            <tbody>
              {categoryStats.map((cat) => (
                <tr key={cat.category}>
                  <td>{cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}</td>
                  <td>{cat.totalOrders}</td>
                  <td>{cat.totalQuantity}</td>
                  <td>LKR {cat.totalRevenue.toLocaleString()}</td>
                  <td>LKR {(cat.totalRevenue / cat.totalOrders).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemSummary;