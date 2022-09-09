import { useEffect, useState } from 'react';

function createContext() {
  const consumers = [];
  let value = '';

  function Provider({ value, children }) {
    value = value;
    consumers.forEach((item) => item(value));
    return children;
  }

  function Consumer({ children }) {
    const [state, setState] = useState(value);
    useEffect(() => {
      consumers.push(setState);
    }, []);

    const date = children(state);
    return date;
  }

  return { Provider, Consumer };
}
