import React, { useState, useTransition, useDeferredValue } from 'react';
import './index.css';
export function FilterList({ names }) {
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState('');
  const [isPending, startTransition] = useTransition();
  //   const deferredValue = useDeferredValue(query);
  const changeHandler = ({ target: { value } }) => {
    console.log('value', value);
    setQuery(value);
    startTransition(() => setHighlight(value));
  };
  return (
    <div>
      <input onInput={changeHandler} value={query} type='text' />
      {names.map((name, i) => (
        <ListItem key={i} name={name} highlight={highlight} />
      ))}
    </div>
  );
}
function ListItem({ name, highlight }) {
  const index = name.toLowerCase().indexOf(highlight.toLowerCase());
  if (index === -1) {
    return <div>{name}</div>;
  }
  return (
    <div>
      {name.slice(0, index)}
      <span className='highlight'>
        {name.slice(index, index + highlight.length)}
      </span>
      {name.slice(index + highlight.length)}
    </div>
  );
}

const TestTransition = () => {
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState('');
  const [show, setShow] = useState(true);
  const deferredValue = useDeferredValue(inputValue);
  console.log('deferredValue', deferredValue, 'inputValue', inputValue);

  function handleClick(e) {
    // setInputValue(e.target.value);
    setInputValue(inputValue + 1);
    startTransition(() => {
      setShow(false);
    });
  }

  return (
    <div>
      <FilterList names={Array(10).fill('hello')}></FilterList>
    </div>
  );
};

export default TestTransition;
