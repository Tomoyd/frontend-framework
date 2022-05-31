import React from 'react';
import {
  ScoreProvider,
  useScoreApiContext,
  useScoreContext,
} from './storeContext';

const ScoreButton = () => {
  const { increaseScore, decreaseScore } = useScoreApiContext();
  console.log('1111 :>> ', 1111);
  return (
    <>
      <button onClick={increaseScore}>increase</button>
      <button onClick={decreaseScore}>decrease</button>
    </>
  );
};

const ScoreValue = () => {
  const value = useScoreContext();
  console.log('value :>> ', value);
  return <div>{value}</div>;
};

const StorePanel = () => {
  return (
    <ScoreProvider>
      <ScoreButton></ScoreButton>
      <ScoreValue></ScoreValue>
    </ScoreProvider>
  );
};

export default StorePanel;
