import { createContext, useState, useContext, useMemo } from 'react';
import React from 'react';
import { shuffle } from 'lodash-es';
const ItemContext = createContext(null);
const ItemOperateContext = createContext(null);

export const useItemContext = () => {
  const items = useContext(ItemContext);
  if (!items) {
    throw new Error('must be used in ItemContext.Provider');
  }
  return items;
};
export const useItemOperateContext = () => {
  const operates = useContext(ItemOperateContext);
  if (!operates) {
    throw new Error('must be used in ItemOperateContext.Provider');
  }
  return operates;
};

export const ItemContextProvider = ({ children }) => {
  const [items, setItems] = useState([0, 1, 2, 3, 4]);
  const operate = useMemo(() => {
    return {
      add: () => setItems((items) => [...items, items.length]),
      reset: () => setItems([0, 1, 2, 3, 4]),
      shuffle: () => setItems(shuffle),
    };
  }, [setItems]);
  return (
    <ItemContext.Provider value={items}>
      <ItemOperateContext.Provider value={operate}>
        {children}
      </ItemOperateContext.Provider>
    </ItemContext.Provider>
  );
};
