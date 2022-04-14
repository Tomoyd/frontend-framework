import { useEffect, useLayoutEffect } from 'react';
import './App.css';
import {
  InheritanceInversionComponent,
  PropProxyComponent,
} from './demos/higher-component';
import TestSelector from './demos/testRedux/TestSelector';
import TestStaticStore from './demos/testRedux/TestStaticStore';
import TestTransition from './demos/testTransition';

function App() {
  useLayoutEffect(() => {
    // console.log('useLayout');
    // return () => {
    //   console.log('useLayout>>clean', 1234);
    // };
  });
  useEffect(() => {
    // console.log('useEffect');
    // return () => {
    //   console.log('useEffect>>clean');
    // };
  }, []);
  return (
    <div className='App'>
      <TestTransition />
      <TestSelector />
      <TestStaticStore />
      <header className='App-header'>
        <PropProxyComponent />
        <InheritanceInversionComponent></InheritanceInversionComponent>
      </header>
    </div>
  );
}

export default App;
