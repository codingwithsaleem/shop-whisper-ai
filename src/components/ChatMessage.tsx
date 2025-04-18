
import { useState } from 'react';
import type { ChatMessage as ChatMessageType, Product } from './ChatWidget';
import ProductCard from './ProductCard';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { content, sender, products, isLoading } = message;
  
  // Show a maximum of 3 products initially
  const [showAllProducts, setShowAllProducts] = useState(false);
  const displayedProducts = products 
    ? showAllProducts 
      ? products 
      : products.slice(0, 3) 
    : [];
  const hasMoreProducts = products && products.length > 3;

  return (
    <div className={`flex mb-4 ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3/4 rounded-lg p-3 ${
          sender === 'user'
            ? 'bg-purple-600 text-white rounded-br-none'
            : 'bg-white border border-gray-200 rounded-bl-none'
        }`}
      >
        {isLoading ? (
          <div className="flex space-x-1 justify-center items-center h-6">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        ) : (
          <>
            <p className={sender === 'assistant' ? 'text-gray-800' : ''}>{content}</p>
            
            {products && products.length > 0 && (
              <div className="mt-3">
                <div className="grid gap-2">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {hasMoreProducts && (
                  <button 
                    onClick={() => setShowAllProducts(!showAllProducts)}
                    className="text-purple-600 text-sm mt-2 hover:underline"
                  >
                    {showAllProducts ? 'Show fewer products' : `Show ${products.length - 3} more products`}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
