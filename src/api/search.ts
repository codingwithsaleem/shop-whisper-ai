import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import type { Product } from '../components/ChatWidget';

// Polyfill for Node.js global in browser environment
if (typeof global === 'undefined') {
  (window as any).global = window;
}

// Placeholder for actual API keys - these should come from environment variables
// or be entered by the user in a secure way
let OPENAI_API_KEY = '';
let PINECONE_API_KEY = '';
let PINECONE_ENVIRONMENT = '';
let PINECONE_INDEX = '';

// Initialize OpenAI client
const initializeOpenAI = () => {
  if (!OPENAI_API_KEY) {
    // For development, you can ask the user to input the API key
    // This should be replaced with a server-side implementation in production
    OPENAI_API_KEY = window.prompt('Please enter your OpenAI API key') || '';
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is required');
    }
  }
  
  return new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Note: This is not recommended for production
  });
};

// Initialize Pinecone client
const initializePinecone = () => {
  if (!PINECONE_API_KEY || !PINECONE_ENVIRONMENT || !PINECONE_INDEX) {
    // For development, you can ask the user to input Pinecone details
    // This should be replaced with a server-side implementation in production
    PINECONE_API_KEY = window.prompt('Please enter your Pinecone API key') || '';
    PINECONE_ENVIRONMENT = window.prompt('Please enter your Pinecone environment') || '';
    PINECONE_INDEX = window.prompt('Please enter your Pinecone index name') || '';
    
    if (!PINECONE_API_KEY || !PINECONE_ENVIRONMENT || !PINECONE_INDEX) {
      throw new Error('Pinecone API key, environment, and index name are required');
    }
  }
  
  try {
    return new Pinecone({
      apiKey: PINECONE_API_KEY,
      environment: PINECONE_ENVIRONMENT
    });
  } catch (error) {
    console.error('Error initializing Pinecone:', error);
    throw error;
  }
};

// Generate embedding for a query using OpenAI
const generateEmbedding = async (query: string): Promise<number[]> => {
  const openai = initializeOpenAI();
  
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: query
  });
  
  return response.data[0].embedding;
};

// Search Pinecone index using the generated embedding
interface PineconeSearchResult {
  id: string;
  score: number;
  values: number[];
  metadata: {
    name: string;
    price: string;
    image: string;
    link: string;
    description?: string;
    [key: string]: any;
  };
}

const searchPinecone = async (embedding: number[]): Promise<PineconeSearchResult[]> => {
  try {
    const pinecone = initializePinecone();
    const index = pinecone.index(PINECONE_INDEX);
    
    const queryResponse = await index.query({
      vector: embedding,
      topK: 10,
      includeValues: false,
      includeMetadata: true
    });
    
    return queryResponse.matches as PineconeSearchResult[];
  } catch (error) {
    console.error('Error querying Pinecone:', error);
    throw error;
  }
};

// Generate a conversational response based on search results
const generateResponse = async (
  query: string,
  searchResults: PineconeSearchResult[]
): Promise<string> => {
  if (searchResults.length === 0) {
    return "I couldn't find any products matching your query. Could you try describing what you're looking for differently?";
  }
  
  const openai = initializeOpenAI();
  
  // Prepare the product information for the prompt
  const productInfo = searchResults
    .map((result, index) => {
      const { name, price, description = '' } = result.metadata;
      return `Product ${index + 1}: ${name}\nPrice: ${price}\nDescription: ${description}\nSimilarity Score: ${result.score.toFixed(2)}`;
    })
    .join('\n\n');
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Use the model you prefer
    messages: [
      {
        role: 'system',
        content: `You are a friendly shopping assistant. Your task is to recommend products based on the user's query and the search results provided. Be conversational, helpful, and suggest the most relevant products. Don't list all products unless necessary, focus on the best matches. If the query seems like a follow-up question, treat it as such and respond accordingly.`
      },
      {
        role: 'user',
        content: `User query: "${query}"\n\nAvailable products:\n${productInfo}\n\nPlease provide a friendly, conversational response recommending suitable products from this list. Don't list all products explicitly, just mention the best fits naturally in your response.`
      }
    ],
    max_tokens: 250
  });
  
  return response.choices[0].message.content || "I found some products that might interest you!";
};

// Convert Pinecone search results to Product objects
const mapResultsToProducts = (results: PineconeSearchResult[]): Product[] => {
  return results.map((result) => ({
    id: result.id,
    name: result.metadata.name,
    price: result.metadata.price,
    image: result.metadata.image,
    link: result.metadata.link,
    description: result.metadata.description
  }));
};

// Main search function to be used by the chat widget
export const searchProducts = async (query: string) => {
  try {
    // Generate embedding for the query
    const embedding = await generateEmbedding(query);
    
    // Search Pinecone using the embedding
    const searchResults = await searchPinecone(embedding);
    
    // Generate a conversational response
    const message = await generateResponse(query, searchResults);
    
    // Map Pinecone results to Product objects
    const products = mapResultsToProducts(searchResults);
    
    return {
      message,
      products
    };
  } catch (error) {
    console.error('Error in searchProducts:', error);
    throw error;
  }
};
