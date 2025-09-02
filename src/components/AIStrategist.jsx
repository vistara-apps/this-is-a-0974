import React, { useState } from 'react'
import { Brain, Send, Sparkles, Target, Users, MessageSquare, TrendingUp, Lightbulb } from 'lucide-react'

const strategySuggestions = [
  "Generate a campaign strategy for a new skincare product launch targeting Gen Z",
  "Create an influencer brief for a sustainable fashion brand",
  "Optimize my current food delivery campaign for better ROI",
  "Develop a fitness app promotion strategy using micro-influencers"
]

const mockResponses = {
  strategy: {
    title: "AI-Generated Campaign Strategy",
    sections: [
      {
        title: "Campaign Overview",
        content: "Based on your inputs, I recommend a multi-phase influencer campaign focusing on authenticity and user-generated content. This approach will maximize engagement while building long-term brand loyalty."
      },
      {
        title: "Target Audience Analysis",
        content: "Primary: Women aged 25-40, urban professionals with disposable income. Secondary: Eco-conscious millennials interested in sustainable lifestyle choices. Tertiary: Fashion enthusiasts who follow trend-setting micro-influencers."
      },
      {
        title: "Influencer Selection Criteria",
        content: "Focus on micro-influencers (10K-100K followers) with 5%+ engagement rates in fashion, lifestyle, and sustainability niches. Prioritize creators who regularly feature brand collaborations and have authentic audience interactions."
      },
      {
        title: "Content Strategy",
        content: "Mix of unboxing videos (40%), styling posts (35%), and lifestyle integration content (25%). Encourage user-generated content with branded hashtags. Include product tutorials and before/after comparisons."
      },
      {
        title: "Budget Allocation",
        content: "Influencer fees: 60% ($3,000), Content production: 20% ($1,000), Paid promotion boost: 15% ($750), Performance tracking tools: 5% ($250). Reserve 10% for optimization based on early results."
      }
    ]
  }
}

export default function AIStrategist() {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: "Hello! I'm your AI Campaign Strategist. I can help you create data-driven influencer marketing strategies, optimize existing campaigns, and provide actionable insights. What would you like to work on today?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = {
        type: 'assistant',
        content: "I've analyzed your request and generated a comprehensive campaign strategy. Here's my recommendation:",
        strategy: mockResponses.strategy,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 2000)
  }

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion)
  }

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">AI Campaign Strategist</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get personalized campaign strategies, optimization recommendations, and data-driven insights 
          to maximize your influencer marketing ROI.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <Target className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-2">Strategy Generator</h3>
          <p className="text-sm text-muted-foreground">Create tailored campaign strategies</p>
        </div>
        <div className="card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <TrendingUp className="w-8 h-8 text-accent mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-2">Performance Analysis</h3>
          <p className="text-sm text-muted-foreground">Analyze and optimize campaigns</p>
        </div>
        <div className="card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <Users className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-2">Audience Insights</h3>
          <p className="text-sm text-muted-foreground">Understand your target market</p>
        </div>
        <div className="card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <Lightbulb className="w-8 h-8 text-accent mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-2">Creative Ideas</h3>
          <p className="text-sm text-muted-foreground">Generate content concepts</p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="card">
        {/* Messages */}
        <div className="h-96 overflow-y-auto mb-6 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : ''}`}>
                <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-gradient-to-br from-accent to-primary text-white'
                  }`}>
                    {message.type === 'user' ? '👤' : <Brain className="w-4 h-4" />}
                  </div>
                  <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-muted text-foreground'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      {message.strategy && (
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center space-x-2 pb-2 border-b border-border">
                            <Sparkles className="w-4 h-4 text-accent" />
                            <h3 className="font-semibold">{message.strategy.title}</h3>
                          </div>
                          {message.strategy.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="text-left">
                              <h4 className="font-medium mb-2 text-foreground">{section.title}</h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                            </div>
                          ))}
                          <div className="flex space-x-2 pt-4 border-t border-border">
                            <button className="btn btn-primary text-xs py-1 px-3">
                              Save Strategy
                            </button>
                            <button className="btn btn-outline text-xs py-1 px-3">
                              Create Campaign
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Try asking about:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {strategySuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe your campaign goals, target audience, or ask for optimization advice..."
              className="input w-full pr-12"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}