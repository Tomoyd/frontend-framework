import { createContext, useContext, useMemo, useState } from 'react';

const ScoreContext = createContext(null);
const ScoreApiContext = createContext(null);

export const useScoreContext = () => {
  const ctx = useContext(ScoreContext);
  if (typeof ctx === 'undefined') {
    throw new Error('useScoreContext must be used within ScoreContextProvider');
  }
  return ctx;
};

/**
 *
 * @returns {{increaseScore:()=>void,decreaseScore:()=>void}}
 */

export const useScoreApiContext = () => {
  const ctx = useContext(ScoreApiContext);
  if (typeof ctx === 'undefined') {
    throw new Error(
      'useScoreApiContext must be used within ScoreAPIContextProvider',
    );
  }
  return ctx;
};

export const ScoreProvider = ({ children }) => {
  const [score, setScore] = useState(0);

  const scoreApi = useMemo(
    () => ({
      increaseScore: () => setScore((v) => v + 1),
      decreaseScore: () => setScore((v) => v - 1),
    }),
    [setScore],
  );

  return (
    <ScoreContext.Provider value={score}>
      <ScoreApiContext.Provider value={scoreApi}>
        {children}
      </ScoreApiContext.Provider>
    </ScoreContext.Provider>
  );
};
