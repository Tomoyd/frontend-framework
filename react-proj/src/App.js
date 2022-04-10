import { useEffect, useLayoutEffect, useState } from 'react';
import './App.css';
import {
  InheritanceInversionComponent,
  PropProxyComponent,
} from './demos/higher-component';

function App() {
  const [count, setCount] = useState(0);
  useLayoutEffect(() => {
    console.log('useLayout');
    return () => {
      console.log('useLayout>>clean', 1234);
    };
  });
  useEffect(() => {
    console.log('useEffect');
    return () => {
      console.log('useEffect>>clean');
    };
  }, []);
  return (
    <div className='App'>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>add</button>
      <header className='App-header'>
        <PropProxyComponent />
        <InheritanceInversionComponent></InheritanceInversionComponent>
      </header>
    </div>
  );
}

export default App;
