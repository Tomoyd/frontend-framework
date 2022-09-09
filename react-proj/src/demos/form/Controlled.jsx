import React, { useState } from 'react';
const Uncontrolled = () => {
  const [state, setState] = useState('1');
  return (
    <form>
      <div>{state}</div>
      <input defaultValue={state} onChange={(e) => setState(e.target.value)} />
    </form>
  );
};
const Controlled = () => {
  const [state, setState] = useState('1');
  return (
    <form>
      <div>{state}</div>
      <input value={state} onChange={(e) => setState(e.target.value)} />
    </form>
  );
};

export default Controlled;
