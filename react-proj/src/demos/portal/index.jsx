import React, { useState } from 'react';
import ModalPortal from './ModalPortal';

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div>modal portal</div>
      <button onClick={toggle}>Open</button>
      <ModalPortal show={isOpen}>
        <button onClick={toggle}> close</button>
      </ModalPortal>
    </>
  );
};

export default Index;
