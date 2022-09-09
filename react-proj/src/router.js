import React from 'react';

export const routes = [
  {
    path: '/demo/flip',
    Component: React.lazy(() => import('./demos/animate/Flip.jsx')),
  },
  {
    path: '/demo/monitorHeight',
    Component: React.lazy(() => import('./demos/monitor/MonitorHeight.jsx')),
  },
  {
    path: '/demo/opt/contentVisibility',
    Component: React.lazy(() =>
      import('./demos/optimization/ContentVisibility.jsx')
    ),
  },
  {
    path: '/demo/form/uncontrolled',
    Component: React.lazy(() => import('./demos/form/Uncontrolled.jsx')),
  },
  {
    path: '/demo/form/controlled',
    Component: React.lazy(() => import('./demos/form/Controlled.jsx')),
  },
  {
    path: '/demo/portal',
    Component: React.lazy(() => import('./demos/portal/index.jsx')),
  },
];
