

// src/components/LaundryList.js
import React from 'react';
import LaundryItem from './LaundryItem';

const LaundryList = ({ items, onDelete }) => {
  return (
    <div>
      {items.map(item => (
        <LaundryItem key={item.id} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default LaundryList;