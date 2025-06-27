// app/components/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children }) => {
  return <button className="bg-blue-500 text-white p-2 rounded">{children}</button>;
};

export default Button;