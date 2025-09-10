"use client";

import { useState } from 'react';

interface DonationButtonProps {
  type: 'jugo' | 'pizza' | 'libro' | 'auto';
  onDonate: (type: string, amount: number) => void;
}

const donationConfig = {
  jugo: { amount: 5000, label: '🧃 Jugo' },
  pizza: { amount: 10000, label: '🍕 Pizza' },
  libro: { amount: 15000, label: '📚 Libro' },
  auto: { amount: 20000, label: '🚗 Auto' }
};

export default function DonationButton({ type, onDonate }: DonationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const config = donationConfig[type];

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onDonate(type, config.amount);
    } catch (error) {
      console.error('Error processing donation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="pixel-button"
      style={{ 
        fontSize: '10px',
        padding: '8px 12px',
        minWidth: '80px',
        opacity: isLoading ? 0.7 : 1,
        cursor: isLoading ? 'not-allowed' : 'pointer'
      }}
      disabled={isLoading}
    >
      {isLoading ? '⏳' : config.label}
    </button>
  );
}
