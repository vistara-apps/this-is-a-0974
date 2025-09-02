import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useUI } from '../context/UIContext';

export default function usePerformanceMetrics(campaignId) {
  const [metrics, setMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useUI();

  // Fetch metrics for a campaign
  const fetchMetrics = async (id = campaignId) => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await api.metrics.getCampaignMetrics(id);
      
      if (error) {
        setError(error.message);
        showToast('Failed to fetch metrics: ' + error.message, 'error');
        return;
      }
      
      setMetrics(data || []);
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to fetch metrics: ' + errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new metric
  const addMetric = async (metricData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newMetric = {
        ...metricData,
        timestamp: new Date().toISOString()
      };
      
      const { data, error } = await api.metrics.addMetric(newMetric);
      
      if (error) {
        setError(error.message);
        showToast('Failed to add metric: ' + error.message, 'error');
        return null;
      }
      
      // Update local state
      setMetrics([data, ...metrics]);
      
      showToast('Metric added successfully', 'success');
      return data;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to add metric: ' + errorMessage, 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate aggregated metrics
  const calculateAggregatedMetrics = (metricsList = metrics) => {
    if (!metricsList.length) {
      return {
        reach: 0,
        engagement: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0
      };
    }
    
    // Group metrics by type
    const groupedMetrics = metricsList.reduce((acc, metric) => {
      if (!acc[metric.metricName]) {
        acc[metric.metricName] = [];
      }
      
      acc[metric.metricName].push(metric.value);
      return acc;
    }, {});
    
    // Calculate totals
    return {
      reach: sum(groupedMetrics.reach || []),
      engagement: average(groupedMetrics.engagement || []),
      clicks: sum(groupedMetrics.clicks || []),
      conversions: sum(groupedMetrics.conversions || []),
      revenue: sum(groupedMetrics.revenue || [])
    };
  };

  // Calculate metrics by influencer
  const calculateInfluencerMetrics = (metricsList = metrics) => {
    if (!metricsList.length) return [];
    
    // Group metrics by influencer
    const influencerMetrics = metricsList.reduce((acc, metric) => {
      if (!metric.influencerId) return acc;
      
      if (!acc[metric.influencerId]) {
        acc[metric.influencerId] = {
          influencerId: metric.influencerId,
          metrics: {}
        };
      }
      
      if (!acc[metric.influencerId].metrics[metric.metricName]) {
        acc[metric.influencerId].metrics[metric.metricName] = [];
      }
      
      acc[metric.influencerId].metrics[metric.metricName].push(metric.value);
      return acc;
    }, {});
    
    // Calculate aggregated metrics for each influencer
    return Object.values(influencerMetrics).map(influencer => ({
      influencerId: influencer.influencerId,
      reach: sum(influencer.metrics.reach || []),
      engagement: average(influencer.metrics.engagement || []),
      clicks: sum(influencer.metrics.clicks || []),
      conversions: sum(influencer.metrics.conversions || []),
      revenue: sum(influencer.metrics.revenue || [])
    }));
  };

  // Calculate metrics over time
  const calculateMetricsOverTime = (metricsList = metrics, interval = 'day') => {
    if (!metricsList.length) return [];
    
    // Group metrics by time interval
    const timeMetrics = metricsList.reduce((acc, metric) => {
      const date = new Date(metric.timestamp);
      let timeKey;
      
      switch (interval) {
        case 'hour':
          timeKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`;
          break;
        case 'day':
          timeKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
          break;
        case 'week':
          // Get the first day of the week (Sunday)
          const firstDay = new Date(date);
          const day = date.getDay();
          const diff = date.getDate() - day;
          firstDay.setDate(diff);
          timeKey = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1}-${firstDay.getDate()}`;
          break;
        case 'month':
          timeKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          break;
        default:
          timeKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      }
      
      if (!acc[timeKey]) {
        acc[timeKey] = {
          timestamp: timeKey,
          metrics: {}
        };
      }
      
      if (!acc[timeKey].metrics[metric.metricName]) {
        acc[timeKey].metrics[metric.metricName] = [];
      }
      
      acc[timeKey].metrics[metric.metricName].push(metric.value);
      return acc;
    }, {});
    
    // Calculate aggregated metrics for each time interval
    return Object.values(timeMetrics)
      .map(time => ({
        timestamp: time.timestamp,
        reach: sum(time.metrics.reach || []),
        engagement: average(time.metrics.engagement || []),
        clicks: sum(time.metrics.clicks || []),
        conversions: sum(time.metrics.conversions || []),
        revenue: sum(time.metrics.revenue || [])
      }))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  // Helper functions
  const sum = (values) => values.reduce((sum, value) => sum + value, 0);
  const average = (values) => values.length ? sum(values) / values.length : 0;

  // Fetch metrics when campaignId changes
  useEffect(() => {
    if (campaignId) {
      fetchMetrics();
    }
  }, [campaignId]);

  return {
    metrics,
    isLoading,
    error,
    fetchMetrics,
    addMetric,
    calculateAggregatedMetrics,
    calculateInfluencerMetrics,
    calculateMetricsOverTime
  };
}

