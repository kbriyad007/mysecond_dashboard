interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (name: string) => void; // 👈 NEW
  clearCart: () => void;
}

// Inside CartProvider...
const removeFromCart = (name: string) => {
  setCart((prev) => prev.filter((item) => item.name !== name));
};

return (
  <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
    {children}
  </CartContext.Provider>
);
