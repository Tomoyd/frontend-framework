import { createStore } from 'redux';

export const ADD = 'add';

function reducer(state, action) {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        name: action.name,
      };
    default:
      return state;
  }
}

const store = createStore(reducer, { name: 1, add: 1 });
export default store;
