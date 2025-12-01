import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Admin } from './pages/Admin';
import { ProductDetail } from './pages/ProductDetail';
import { Favourites } from './pages/Favourites';
import { Account } from './pages/Account';
import { getProducts } from './services/storage';
import { Product, CartItem, ViewState } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Favourites State
  const [favourites, setFavourites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('tsuyanouchi_favs');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Save favourites to localStorage
  useEffect(() => {
    localStorage.setItem('tsuyanouchi_favs', JSON.stringify(favourites));
  }, [favourites]);

  // Load products on mount
  useEffect(() => {
    refreshProducts();
  }, []);

  const refreshProducts = () => {
    setProducts(getProducts());
  };

  const handleAddToCart = (product: Product) => {
    // Check if item exists with same ID AND same size
    // Product passed here might already have a selectedSize property attached from ProductDetail
    const productSizeLabel = (product as any).selectedSize?.label;

    setCartItems(prev => {
      const existing = prev.find(item => {
          const sameId = item.id === product.id;
          const sameSize = item.selectedSize?.label === productSizeLabel;
          // If product has no size, size check is irrelevant (both undefined)
          if (!productSizeLabel && !item.selectedSize) return sameId;
          return sameId && sameSize;
      });

      if (existing) {
        return prev.map(item => {
             const sameId = item.id === product.id;
             const sameSize = item.selectedSize?.label === productSizeLabel;
             if (!productSizeLabel && !item.selectedSize) {
                 return sameId ? { ...item, quantity: item.quantity + 1 } : item;
             }
             return (sameId && sameSize) ? { ...item, quantity: item.quantity + 1 } : item;
        });
      }
      return [...prev, { ...product, quantity: 1 } as CartItem];
    });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView(ViewState.PRODUCT);
  };

  const handleToggleFavourite = (id: string) => {
    setFavourites(prev => {
      if (prev.includes(id)) {
        return prev.filter(favId => favId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME:
        return (
          <Home 
            featuredProducts={products} 
            onNavigate={setCurrentView} 
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
            favourites={favourites}
            onToggleFavourite={handleToggleFavourite}
          />
        );
      case ViewState.SHOP:
        return (
          <Shop 
            products={products} 
            onAddToCart={handleAddToCart} 
            onProductClick={handleProductClick}
            favourites={favourites}
            onToggleFavourite={handleToggleFavourite}
          />
        );
      case ViewState.FAVOURITES:
        return (
          <Favourites 
            products={products} 
            favourites={favourites}
            onAddToCart={handleAddToCart} 
            onProductClick={handleProductClick}
            onToggleFavourite={handleToggleFavourite}
            onNavigate={setCurrentView}
          />
        );
      case ViewState.ACCOUNT:
        return (
          <Account 
            onNavigate={setCurrentView}
          />
        );
      case ViewState.ADMIN:
        return (
          <Admin 
            products={products} 
            refreshProducts={refreshProducts} 
          />
        );
      case ViewState.PRODUCT:
        if (!selectedProduct) return null; // Should not happen
        return (
          <ProductDetail 
            product={selectedProduct} 
            onAddToCart={handleAddToCart}
            onBack={() => setCurrentView(ViewState.SHOP)}
            isFavourite={favourites.includes(selectedProduct.id)}
            onToggleFavourite={handleToggleFavourite}
          />
        );
      default:
        return (
          <Home 
            featuredProducts={products} 
            onNavigate={setCurrentView} 
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
            favourites={favourites}
            onToggleFavourite={handleToggleFavourite}
          />
        );
    }
  };

  // If Admin view, we don't show the standard Layout (it has its own sidebar)
  if (currentView === ViewState.ADMIN) {
      return (
          <>
            <div className="fixed top-4 right-4 z-50">
                <button 
                    onClick={() => setCurrentView(ViewState.HOME)}
                    className="bg-white/90 backdrop-blur text-xs px-3 py-1 rounded shadow border hover:bg-gray-100"
                >
                    Back to Site
                </button>
            </div>
            <Admin products={products} refreshProducts={refreshProducts} />
          </>
      )
  }

  return (
    <Layout 
      cartItems={cartItems} 
      setCartItems={setCartItems}
      currentView={currentView}
      onNavigate={setCurrentView}
      favouriteCount={favourites.length}
    >
      {renderView()}
    </Layout>
  );
}

export default App;