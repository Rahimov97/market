import React from "react";
import { useCart } from "../../hooks/useCart";

const Cart: React.FC = () => {
  const { cart, loading, error } = useCart();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.productId}>
              <h3>{item.productId.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.productId.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
