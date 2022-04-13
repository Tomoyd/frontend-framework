import { ADD } from './index.js';

export const nameActionCreator = (name) => {
  return {
    type: ADD,
    name: name,
  };
};
