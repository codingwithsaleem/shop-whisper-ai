
import { ExternalLink } from 'lucide-react';
import type { Product } from './ChatWidget';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { name, price, image, link, description } = product;
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
        {!imageError ? (
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover" 
            onError={handleImageError}
          />
        ) : (
          <div className="text-xs text-gray-400 text-center">No image</div>
        )}
      </div>
      
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{name}</h4>
          <ExternalLink size={14} className="text-gray-400 flex-shrink-0" />
        </div>
        
        {description && (
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{description}</p>
        )}
        
        <p className="text-sm font-bold text-purple-700 mt-1">{price}</p>
      </div>
    </a>
  );
};

export default ProductCard;
