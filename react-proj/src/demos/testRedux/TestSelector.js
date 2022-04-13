import React from 'react';
import { useSelector } from 'react-redux';

const TestSelector = () => {
  const name = useSelector((state) => state.name);
  return <div>{name}</div>;
};

export default TestSelector;
