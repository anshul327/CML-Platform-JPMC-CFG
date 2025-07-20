import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, 
  Bot, 
  Leaf, 
  ArrowLeft, 
  Loader2, 
  MessageCircle, 
  Sparkles,
  Lightbulb,
  BookOpen,
  TrendingUp
} from 'lucide-react';

const AIAssistantPage = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');

    // Add user message to chat history
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatHistory(prev => [...prev, userMessage]);

    try {
      const formData = new FormData();
      formData.append('query', query);

      const response = await fetch('http://localhost:8000/api/v1/farmer-assistant/text-query', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add AI response to chat history
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.response || data.message || 'No response received',
        timestamp: new Date().toLocaleTimeString()
      };

      setChatHistory(prev => [...prev, aiMessage]);
      setResponse(data.response || data.message || 'No response received');
      setQuery('');
    } catch (err) {
      console.error('AI Query error:', err);
      setError('Failed to get response from AI. Please try again.');
      
      // Add error message to chat history
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setResponse('');
    setError('');
  };

  const exampleQueries = [
    "How to improve soil fertility naturally?",
    "What are the best practices for organic farming?",
    "How to identify and treat common crop diseases?",
    "What crops are suitable for monsoon season?",
    "How to manage water resources efficiently?",
    "What are the signs of nutrient deficiency in plants?"
  ];

  const handleExampleClick = (example) => {
    setQuery(example);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <Bot className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AI Agricultural Assistant</h1>
                  <p className="text-sm text-gray-600">Get expert farming advice and crop guidance</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-gray-600">Powered by AI</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded-full p-2 mr-3">
                      <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Agricultural AI Assistant</h3>
                      <p className="text-sm text-gray-600">Ask me anything about farming!</p>
                    </div>
                  </div>
                  <button
                    onClick={clearChat}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear Chat
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Start a conversation about farming!</p>
                  </div>
                ) : (
                  chatHistory.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : message.type === 'error'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-start">
                          {message.type === 'ai' && (
                            <Bot className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about farming, crops, soil, pests, or agricultural practices..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </form>
                {error && (
                  <p className="text-red-600 text-sm mt-2">{error}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Quick Examples
              </h3>
              <div className="space-y-2">
                {exampleQueries.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                What I Can Help With
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Crop management advice</span>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Soil health assessment</span>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Pest & disease identification</span>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Organic farming techniques</span>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Water management strategies</span>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-700">Sustainable practices</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-500" />
                AI Assistant Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Conversations</span>
                  <span className="text-sm font-semibold text-gray-900">{chatHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">AI Responses</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {chatHistory.filter(msg => msg.type === 'ai').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm font-semibold text-green-600">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage; 