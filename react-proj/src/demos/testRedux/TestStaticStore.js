import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nameActionCreator } from '../../store/action';

const TestStaticStore = () => {
  const add = useSelector((state) => state.add);
  const dispatch = useDispatch();
  console.log('static' + Date.now());
  return (
    <button
      onClick={() => {
        dispatch(nameActionCreator('Hello' + Math.random()));
      }}
    >
      add name {Math.random()}
      {'>>>' + add}
    </button>
  );
};

export default TestStaticStore;
