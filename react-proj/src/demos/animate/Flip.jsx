import React, { useLayoutEffect } from 'react';
import { useRef } from 'react';
import './flip.css';
import {
  ItemContextProvider,
  useItemContext,
  useItemOperateContext,
} from './flipContext';

const createElementRectMap = (nodes) => {
  if (!nodes) {
    return new Map();
  }
  return new Map(
    Array.from(nodes.childNodes).map((node) => [
      node,
      node.getBoundingClientRect(),
    ])
  );
};

const useAnimation = (nodes) => {
  const lastRectsMap = createElementRectMap(nodes);
  useLayoutEffect(() => {
    const currentRectsMap = createElementRectMap(nodes);
    const lastValues = Array.from(lastRectsMap.values());
    currentRectsMap.forEach((currentRect, node) => {
      const preRect =
        lastRectsMap.get(node) || lastValues[lastValues.length - 1];
      const invert = {
        left: (preRect.left || 0) - currentRect.left,
        top: (preRect.top || 0) - currentRect.top,
      };

      const keyFrames = [
        {
          transform: `translate(${invert.left}px,${invert.top}px)`,
        },
        { transform: 'translate(0,0)' },
      ];
      node.animate(keyFrames, {
        duration: 800,
        easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
      });
    });
  });
};
const ListItems = () => {
  const items = useItemContext();
  const listRef = useRef(null);
  useAnimation(listRef.current);
  return (
    <div ref={listRef} className='list'>
      {items.map((item) => {
        return (
          <div key={item} className='item'>
            {item}
          </div>
        );
      })}
    </div>
  );
};

const Operate = () => {
  const { add, shuffle } = useItemOperateContext();
  return (
    <div className='operate'>
      <button onClick={add} className='btn'>
        添加
      </button>
      <button onClick={shuffle} className='btn'>
        打乱
      </button>
    </div>
  );
};

const Flip = () => {
  return (
    <ItemContextProvider>
      <Operate></Operate>
      <ListItems></ListItems>
    </ItemContextProvider>
  );
};

export default Flip;
