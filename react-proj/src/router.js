import React from 'react';

export const routes = [
  {
    path: '/flip',
    Component: React.lazy(() => import('./demos/animate/Flip.jsx')),
  },
];
