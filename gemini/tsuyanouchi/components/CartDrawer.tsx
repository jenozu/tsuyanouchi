import React, { useMemo } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '../types';
import { Button } from './ui/Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number, sizeLabel?: string) => void;
  onRemove: (id: string, sizeLabel?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove 
}) => {
  const total = useMemo(() => items.reduce((acc, item) => {
      const price = item.selectedSize ? item.selectedSize.price : item.price;
      return acc + (price * item.quantity);
  }, 0), [items]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-[#2D2A26]/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 max-w-md w-full bg-[#F9F8F4] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          <div className="flex items-center justify-between p-6 border-b border-[#E5E0D8]">
            <h2 className="text-xl font-serif text-[#2D2A26]">Shopping Bag ({items.length})</h2>
            <button onClick={onClose} className="p-2 hover:bg-[#E5E0D8] rounded-full transition-colors text-[#2D2A26]">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[#786B59] space-y-4">
                <p>Your bag is empty.</p>
                <Button variant="outline" onClick={onClose}>Continue Shopping</Button>
              </div>
            ) : (
              items.map((item, index) => {
                  const currentPrice = item.selectedSize ? item.selectedSize.price : item.price;
                  // Create a unique key combining ID and Size
                  const itemKey = `${item.id}-${item.selectedSize?.label || 'default'}-${index}`;
                  
                  return (
                    <div key={itemKey} className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden border border-[#E5E0D8]">
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                        <div>
                        <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-[#2D2A26]">{item.name}</h3>
                            <p className="ml-4 text-sm font-medium text-[#2D2A26]">${(currentPrice * item.quantity).toLocaleString()}</p>
                        </div>
                        <p className="mt-1 text-xs text-[#786B59]">{item.category}</p>
                        {item.selectedSize && (
                            <p className="mt-1 text-xs text-[#4A4036] font-medium">Size: {item.selectedSize.label}</p>
                        )}
                        </div>
                        <div className="flex items-center justify-between">
                        <div className="flex items-center border border-[#E5E0D8]">
                            <button 
                            onClick={() => onUpdateQuantity(item.id, -1, item.selectedSize?.label)}
                            className="p-1 hover:bg-[#E5E0D8] disabled:opacity-50 text-[#2D2A26]"
                            disabled={item.quantity <= 1}
                            >
                            <Minus size={14} />
                            </button>
                            <span className="px-3 text-sm text-[#2D2A26]">{item.quantity}</span>
                            <button 
                            onClick={() => onUpdateQuantity(item.id, 1, item.selectedSize?.label)}
                            className="p-1 hover:bg-[#E5E0D8] text-[#2D2A26]"
                            >
                            <Plus size={14} />
                            </button>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => onRemove(item.id, item.selectedSize?.label)}
                            className="text-sm text-[#8C3F3F] hover:text-red-700 flex items-center gap-1"
                        >
                            <Trash2 size={14}/> <span>Remove</span>
                        </button>
                        </div>
                    </div>
                    </div>
                  );
              })
            )}
          </div>

          <div className="border-t border-[#E5E0D8] bg-[#F2EFE9] p-6 space-y-4">
            <div className="flex justify-between text-base font-medium text-[#2D2A26]">
              <p>Subtotal</p>
              <p>${total.toLocaleString()}</p>
            </div>
            <p className="mt-0.5 text-sm text-[#786B59]">Shipping and taxes calculated at checkout.</p>
            <Button className="w-full" disabled={items.length === 0} onClick={() => alert('Checkout functionality coming soon!')}>
              Checkout
            </Button>
          </div>

        </div>
      </div>
    </>
  );
};