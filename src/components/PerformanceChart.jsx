import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', revenue: 4000, reach: 240000, engagement: 4.1 },
  { name: 'Feb', revenue: 3000, reach: 198000, engagement: 3.8 },
  { name: 'Mar', revenue: 5000, reach: 320000, engagement: 4.3 },
  { name: 'Apr', revenue: 4500, reach: 290000, engagement: 4.0 },
  { name: 'May', revenue: 6000, reach: 410000, engagement: 4.5 },
  { name: 'Jun', revenue: 7200, reach: 480000, engagement: 4.7 },
]

export default function PerformanceChart() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Campaign Performance</h3>
          <p className="text-sm text-muted-foreground">Revenue and reach trends over time</p>
        </div>
        <select className="input w-32">
          <option>Last 6 months</option>
          <option>Last 3 months</option>
          <option>Last month</option>
        </select>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(220, 70%, 50%)" 
              strokeWidth={3}
              dot={{ fill: 'hsl(220, 70%, 50%)', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="reach" 
              stroke="hsl(160, 80%, 45%)" 
              strokeWidth={3}
              dot={{ fill: 'hsl(160, 80%, 45%)', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}