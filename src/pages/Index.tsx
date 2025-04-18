
import ChatWidget from '../components/ChatWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main content */}
      <div className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop Whisper AI</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover products with our AI-powered shopping assistant. Ask about products in natural language and get personalized recommendations.
          </p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Try asking about:</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <p className="font-medium text-purple-800">Products by feature</p>
              <p className="text-gray-700 text-sm mt-1">
                "Do you have waterproof hiking boots that are good for winter?"
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <p className="font-medium text-purple-800">Products by price range</p>
              <p className="text-gray-700 text-sm mt-1">
                "Show me dresses under $50 for a summer wedding"
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <p className="font-medium text-purple-800">Products by occasion</p>
              <p className="text-gray-700 text-sm mt-1">
                "What gifts would be good for a tech enthusiast?"
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <p className="font-medium text-purple-800">Follow-up questions</p>
              <p className="text-gray-700 text-sm mt-1">
                "Can you show me something similar but cheaper?"
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default Index;
