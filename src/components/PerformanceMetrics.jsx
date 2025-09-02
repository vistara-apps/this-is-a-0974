import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';

export default function PerformanceMetrics({ campaignId }) {
  const [timeRange, setTimeRange] = useState('30d');
  const [metricType, setMetricType] = useState('reach');
  const { 
    metrics, 
    isLoading, 
    calculateAggregatedMetrics, 
    calculateInfluencerMetrics, 
    calculateMetricsOverTime 
  } = usePerformanceMetrics(campaignId);

  // Calculate metrics
  const aggregatedMetrics = calculateAggregatedMetrics();
  const influencerMetrics = calculateInfluencerMetrics();
  const timeMetrics = calculateMetricsOverTime();

  // Filter metrics by time range
  const filteredTimeMetrics = timeMetrics.filter(metric => {
    const date = new Date(metric.timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    switch (timeRange) {
      case '7d':
        return diffDays <= 7;
      case '30d':
        return diffDays <= 30;
      case '90d':
        return diffDays <= 90;
      case 'all':
        return true;
      default:
        return diffDays <= 30;
    }
  });

  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toFixed(0);
    }
  };

  // Format percentage for display
  const formatPercentage = (num) => {
    return num.toFixed(1) + '%';
  };

  // Format currency for display
  const formatCurrency = (num) => {
    return '$' + num.toFixed(0);
  };

  // Format metric value based on type
  const formatMetricValue = (value, type) => {
    switch (type) {
      case 'engagement':
        return formatPercentage(value);
      case 'revenue':
        return formatCurrency(value);
      default:
        return formatNumber(value);
    }
  };

  // Calculate trend compared to previous period
  const calculateTrend = (current, previous) => {
    if (!previous) return { value: 0, direction: 'up' };
    
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      direction: change >= 0 ? 'up' : 'down'
    };
  };

  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // If loading, show skeleton
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-muted rounded-lg mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Reach</p>
              <p className="text-2xl font-bold text-foreground">{formatNumber(aggregatedMetrics.reach)}</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpRight className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium ml-1 text-accent">
              +12.5%
            </span>
            <span className="text-sm text-muted-foreground ml-1">vs last period</span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Engagement</p>
              <p className="text-2xl font-bold text-foreground">{formatPercentage(aggregatedMetrics.engagement)}</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpRight className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium ml-1 text-accent">
              +3.2%
            </span>
            <span className="text-sm text-muted-foreground ml-1">vs last period</span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Clicks</p>
              <p className="text-2xl font-bold text-foreground">{formatNumber(aggregatedMetrics.clicks)}</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpRight className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium ml-1 text-accent">
              +8.7%
            </span>
            <span className="text-sm text-muted-foreground ml-1">vs last period</span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conversions</p>
              <p className="text-2xl font-bold text-foreground">{formatNumber(aggregatedMetrics.conversions)}</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowDownRight className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium ml-1 text-red-500">
              -2.1%
            </span>
            <span className="text-sm text-muted-foreground ml-1">vs last period</span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(aggregatedMetrics.revenue)}</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpRight className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium ml-1 text-accent">
              +15.3%
            </span>
            <span className="text-sm text-muted-foreground ml-1">vs last period</span>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Time Range:</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === '7d'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === '30d'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === '90d'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            90 Days
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 'all'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Metric Type Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Metric Type:</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setMetricType('reach')}
            className={`px-3 py-1 text-sm rounded-md ${
              metricType === 'reach'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Reach
          </button>
          <button
            onClick={() => setMetricType('engagement')}
            className={`px-3 py-1 text-sm rounded-md ${
              metricType === 'engagement'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Engagement
          </button>
          <button
            onClick={() => setMetricType('clicks')}
            className={`px-3 py-1 text-sm rounded-md ${
              metricType === 'clicks'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Clicks
          </button>
          <button
            onClick={() => setMetricType('conversions')}
            className={`px-3 py-1 text-sm rounded-md ${
              metricType === 'conversions'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Conversions
          </button>
          <button
            onClick={() => setMetricType('revenue')}
            className={`px-3 py-1 text-sm rounded-md ${
              metricType === 'revenue'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Revenue
          </button>
        </div>
      </div>

      {/* Metrics Over Time Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {metricType.charAt(0).toUpperCase() + metricType.slice(1)} Over Time
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredTimeMetrics}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => formatMetricValue(value, metricType)}
              />
              <Tooltip 
                formatter={(value) => formatMetricValue(value, metricType)}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString();
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={metricType} 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Influencer Performance Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Influencer Performance
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={influencerMetrics.slice(0, 5)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(value) => formatMetricValue(value, metricType)}
                />
                <YAxis 
                  type="category"
                  dataKey="influencerId" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(value) => `Influencer ${value.slice(-4)}`}
                />
                <Tooltip 
                  formatter={(value) => formatMetricValue(value, metricType)}
                  labelFormatter={(value) => `Influencer ${value.slice(-4)}`}
                />
                <Legend />
                <Bar 
                  dataKey={metricType} 
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Metrics Distribution
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Reach', value: aggregatedMetrics.reach },
                    { name: 'Clicks', value: aggregatedMetrics.clicks * 10 },
                    { name: 'Conversions', value: aggregatedMetrics.conversions * 50 },
                    { name: 'Revenue', value: aggregatedMetrics.revenue / 10 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {[
                    { name: 'Reach', value: aggregatedMetrics.reach },
                    { name: 'Clicks', value: aggregatedMetrics.clicks * 10 },
                    { name: 'Conversions', value: aggregatedMetrics.conversions * 50 },
                    { name: 'Revenue', value: aggregatedMetrics.revenue / 10 }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [formatNumber(value), name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

