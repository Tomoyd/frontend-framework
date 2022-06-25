import React, { Suspense } from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { routes } from './router';
function App() {
  return (
    <div className='App'>
      <Suspense>
        <Router>
          <Routes>
            {routes.map(({ path, Component }) => {
              return (
                <Route path={path} element={<Component />} key={path}></Route>
              );
            })}
          </Routes>
        </Router>
      </Suspense>
    </div>
  );
}

export default App;
