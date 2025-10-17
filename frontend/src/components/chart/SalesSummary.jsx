import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { getOrderHistory } from '../../services/api';
import './Chart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const SalesSummary = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('overall');
  const [selectedDate, setSelectedDate] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
    selectedDateStats: { orders: 0, revenue: 0 }
  });

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  useEffect(() => {
    if (orderHistory.length > 0) {
      calculateStats();
    }
  }, [orderHistory, selectedPeriod, selectedDate]);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const response = await getOrderHistory({ limit: 1000 });
      if (response.data.success) {
        setOrderHistory(response.data.data.records);
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    
    let filteredOrders = [...orderHistory];
    
    // Filter by selected period
    if (selectedPeriod === 'today') {
      filteredOrders = orderHistory.filter(order => 
        new Date(order.originalOrderDate).toISOString().split('T')[0] === today
      );
    } else if (selectedPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredOrders = orderHistory.filter(order => 
        new Date(order.originalOrderDate) >= weekAgo
      );
    }

    // Calculate main stats
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Today's stats
    const todayOrders = orderHistory.filter(order => 
      new Date(order.originalOrderDate).toISOString().split('T')[0] === today
    ).length;
    
    const todayRevenue = orderHistory
      .filter(order => new Date(order.originalOrderDate).toISOString().split('T')[0] === today)
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Selected date stats
    let selectedDateStats = { orders: 0, revenue: 0 };
    if (selectedDate) {
      const dateOrders = orderHistory.filter(order => 
        new Date(order.originalOrderDate).toISOString().split('T')[0] === selectedDate
      );
      selectedDateStats = {
        orders: dateOrders.length,
        revenue: dateOrders.reduce((sum, order) => sum + order.totalAmount, 0)
      };
    }

    setStats({
      totalOrders,
      totalRevenue,
      todayOrders,
      todayRevenue,
      selectedDateStats
    });
  };

  const getLast7DaysData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateString = date.toISOString().split('T')[0];
      const dayOrders = orderHistory.filter(order => 
        new Date(order.originalOrderDate).toISOString().split('T')[0] === dateString
      );
      
      last7Days.push({
        date: dateString,
        label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + order.totalAmount, 0)
      });
    }
    
    return last7Days;
  };

  const getLast6MonthsData = () => {
    const last6Months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthString = date.toISOString().slice(0, 7); // YYYY-MM format
      
      const monthOrders = orderHistory.filter(order => {
        const orderMonth = new Date(order.originalOrderDate).toISOString().slice(0, 7);
        return orderMonth === monthString;
      });
      
      last6Months.push({
        month: monthString,
        label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        orders: monthOrders.length,
        revenue: monthOrders.reduce((sum, order) => sum + order.totalAmount, 0)
      });
    }
    
    return last6Months;
  };

  const last7DaysData = getLast7DaysData();
  const last6MonthsData = getLast6MonthsData();

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

  const last7DaysChartData = {
    labels: last7DaysData.map(day => day.label),
    datasets: [
      {
        label: 'Orders',
        data: last7DaysData.map(day => day.orders),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: 'Revenue (LKR)',
        data: last7DaysData.map(day => day.revenue),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
      },
    ],
  };

  const monthlyChartData = {
    labels: last6MonthsData.map(month => month.label),
    datasets: [
      {
        label: 'Orders',
        data: last6MonthsData.map(month => month.orders),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Revenue (LKR)',
        data: last6MonthsData.map(month => month.revenue),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <div className="loading">Loading sales data...</div>;
  }

  return (
    <div className="sales-summary">
      <div className="stats-grid">
        {/* Period Selector */}
        <div className="stat-card period-selector">
          <h3>Select Period</h3>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="overall">Overall</option>
            <option value="week">This Week</option>
            <option value="today">Today</option>
          </select>
        </div>

        {/* Main Stats */}
        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="stat-value">{stats.totalOrders}</div>
          <div className="stat-label">
            {selectedPeriod === 'overall' ? 'All Time' : 
             selectedPeriod === 'week' ? 'This Week' : 'Today'}
          </div>
        </div>

        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="stat-value">LKR {stats.totalRevenue.toLocaleString()}</div>
          <div className="stat-label">
            {selectedPeriod === 'overall' ? 'All Time' : 
             selectedPeriod === 'week' ? 'This Week' : 'Today'}
          </div>
        </div>

        <div className="stat-card">
          <h3>Today's Orders</h3>
          <div className="stat-value">{stats.todayOrders}</div>
          <div className="stat-label">{new Date().toLocaleDateString()}</div>
        </div>

        <div className="stat-card">
          <h3>Today's Revenue</h3>
          <div className="stat-value">LKR {stats.todayRevenue.toLocaleString()}</div>
          <div className="stat-label">{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      {/* Date Selector */}
      <div className="date-selector-section">
        <div className="date-selector-card">
          <h3>Check Specific Date</h3>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
          {selectedDate && (
            <div className="selected-date-stats">
              <div className="date-stat">
                <span>Orders: {stats.selectedDateStats.orders}</span>
                <span>Revenue: LKR {stats.selectedDateStats.revenue.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Last 7 Days - Orders & Revenue</h3>
          <Bar 
            data={last7DaysChartData} 
            options={{
              ...chartOptions,
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Orders'
                  }
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Revenue (LKR)'
                  },
                  grid: {
                    drawOnChartArea: false,
                  },
                },
              },
            }}
          />
        </div>

        <div className="chart-card">
          <h3>Last 6 Months - Orders & Revenue</h3>
          <Line 
            data={monthlyChartData} 
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesSummary;