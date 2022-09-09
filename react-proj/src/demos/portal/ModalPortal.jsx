import ReactDOM from 'react-dom';
import React from 'react';
const ModalPortal = ({ show = false, children }) => {
  if (!show) {
    return null;
  }
  let portal = document.getElementById('portal');
  if (!portal) {
    portal = document.createElement('div');
    portal.id = 'portal';
    document.body.appendChild(portal);
  }

  return ReactDOM.createPortal(
    <div
      style={{
        background: 'rgba(0,0,0,0.7)',
        height: '100vh',
        left: 0,
        position: 'fixed',
        top: 0,
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>,
    portal
  );
};

export default ModalPortal;
