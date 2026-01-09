import React, { createContext, useContext, useState, ReactNode } from 'react';

type CurrencyType = 'USD' | 'VND';

interface CurrencyContextProps {
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  convertPrice: (price: number, baseCurrency: string) => string;
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

const EXCHANGE_RATE = 24000; // 1 USD = 24,000 VND

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyType>('USD');

  const convertPrice = (price: number, baseCurrency: string) => {
    // Giả sử base price từ DB luôn là USD (như trong Seeder)
    // Nếu baseCurrency khác, cần logic phức tạp hơn. Ở đây ta đơn giản hóa.
    
    let finalPrice = price;
    
    if (currency === 'VND') {
        finalPrice = price * EXCHANGE_RATE;
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalPrice);
    }

    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(finalPrice);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
