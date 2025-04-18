
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize, ShoppingBag } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { searchProducts } from '../api/search';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  products?: Product[];
  isLoading?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  link: string;
  description?: string;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hi there! I\'m your shop assistant powered by AI. I can help you find products using natural language. Try asking me something like "I need a red dress for a summer wedding under $100" or "Do you have eco-friendly sneakers?"',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add loading message for assistant
    const loadingMessage: ChatMessage = {
      id: generateId(),
      content: '',
      sender: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Search for products based on user query
      const response = await searchProducts(inputValue);
      
      // Remove loading message and add assistant response with products
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== loadingMessage.id);
        return [
          ...filtered,
          {
            id: generateId(),
            content: response.message,
            sender: 'assistant',
            timestamp: new Date(),
            products: response.products,
          },
        ];
      });
    } catch (error) {
      console.error('Error searching products:', error);
      
      // Remove loading message and add error message
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== loadingMessage.id);
        return [
          ...filtered,
          {
            id: generateId(),
            content: "I'm sorry, I encountered an error while searching for products. Please try again.",
            sender: 'assistant',
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat toggle button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
          aria-label="Open chat"
        >
          <ShoppingBag size={24} />
        </button>
      )}

      {/* Chat widget */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl flex flex-col w-[90vw] max-w-[380px] h-[80vh] max-h-[500px] border border-gray-200 overflow-hidden">
          {/* Chat header */}
          <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} />
              <h3 className="font-medium">Shop Whisper AI</h3>
            </div>
            <div className="flex space-x-2">
              <button onClick={toggleChat} className="hover:bg-purple-700 p-1 rounded">
                <Minimize size={16} />
              </button>
              <button onClick={toggleChat} className="hover:bg-purple-700 p-1 rounded">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-2 flex">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Ask about products..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`bg-purple-600 text-white px-4 py-2 rounded-r-lg ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
              }`}
              disabled={isLoading}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
