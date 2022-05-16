### redux 源码解析

createStore(reducer,preState,enhancer)

#### 参数说明：

1. reducer 一个函数根据现在是 state 和 action，返回下一个 state 纯函数
2. preloadedState 初始值，如果使用 combineReducers 的话需要，是与 combineReducers 的 key 一致的 Object
3. enhancer ： 第三方中间件增强， Redux 提供的 enhancer 是 applyMiddleWare

#### 源码说明

首先做一些校验判断之后, preloadedState 和 enhancer 同时为 function
或者 enhancer 和第四个参数同时为 function 时，报错

当 preloaded 为 function 且 enhancer 为 undefined 时, preloadedState 会作为 enhancer 使用

也就是说，enhancer 可以是第二个参数，也可以是第三个参数

1. 首先 当 enhancer 存在时，将 createStore 传递给 Enhancer
   同时将 reducer 和 preloadedState 传递给 enhancer(createStore)返回值，
   enhancer(createStore)(reducer,preloaded);
2. 如果 enhancer 不存在，且 reducer 为 function

   - 初始化闭包变量
     currentReducer=reducer
     currentState=preloadedState
     当前的监听器
     下次的监听器函数列表
     是否 dispatch

     ```typescript
     let currentReducer = reducer;
     let currentState = preloadedState as S;
     let currentListeners: (() => void)[] | null = [];
     let nextListeners = currentListeners;
     let isDispatching = false;
     ```

   - 声明一些返回的函数
     dispatch
     subscribe
     getState
     replaceReducer
     observable
   - 执行 dispatch() 初始化

   ```
     dispatch({ type: ActionTypes.INIT } as A)
   ```

   - 返回前面声明的

   ```
   {
     dispatch: dispatch as Dispatch<A>,
     subscribe,
     getState,
     replaceReducer,
     [$$observable]: observable
    }
   ```

返回参数解释

1. dispatch
   首先判断是否是 action，action 的 type 且不能为 undefined
   判断是否在 Dispatching，dispatching 为 true 的话
   则抛出错误 意味着 currentReducer 必须是同步的

   执行 isDispatch=true
   执行 currentReducer(currentState,action),并将 reducer 结果赋值给 currentState
   将 isDispatching 置为 false

   获取 listeners 并执行 listener

2. getState

   如果 isDispatch===true 抛出错误

   否则返回 currentState

3. subscribe

   注册 listener 并对 isDispatching 进行判断

   声明 isSubscribe 置为 true，好判断当前 listener 是否被移除

   如果 nextListeners===currentListeners
   将 nextListener = currentListeners.slice 同步

   并 nextListeners.push(listener)

   且返回一个 unsubscribe
   首先判断已注册且 isDispatching 为 false 则进行卸载
   isSubscribe=false
   使用 splice 进行删除
   且 currentState 置为 null

   ```typescript
   function subscribe(listener: () => void) {
     if (typeof listener !== 'function') {
       throw new Error(
         `Expected the listener to be a function. Instead, received: '${kindOf(
           listener,
         )}'`,
       );
     }

     if (isDispatching) {
       throw new Error(
         'You may not call store.subscribe() while the reducer is executing. ' +
           'If you would like to be notified after the store has been updated, subscribe from a ' +
           'component and invoke store.getState() in the callback to access the latest state. ' +
           'See https://redux.js.org/api/store#subscribelistener for more details.',
       );
     }

     let isSubscribed = true;

     ensureCanMutateNextListeners();
     nextListeners.push(listener);

     return function unsubscribe() {
       if (!isSubscribed) {
         return;
       }

       if (isDispatching) {
         throw new Error(
           'You may not unsubscribe from a store listener while the reducer is executing. ' +
             'See https://redux.js.org/api/store#subscribelistener for more details.',
         );
       }

       isSubscribed = false;

       ensureCanMutateNextListeners();
       const index = nextListeners.indexOf(listener);
       nextListeners.splice(index, 1);
       currentListeners = null;
     };
   }
   ```

4. replaceReducer
   替换 currentReducer

   返回 store， 并且 TS 重置断言 store 的类型

   ```Typescript
     function replaceReducer<NewState, NewActions extends A>(
    nextReducer: Reducer<NewState, NewActions>
   ): Store<ExtendState<NewState, StateExt>, NewActions, StateExt, Ext> & Ext {
    if (typeof nextReducer !== 'function') {
      throw new Error(
        `Expected the nextReducer to be a function. Instead, received: '${kindOf(
          nextReducer
        )}`
      )
    }

    // TODO: do this more elegantly
    ;(currentReducer as unknown as Reducer<NewState, NewActions>) = nextReducer

    // This action has a similar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.
    dispatch({ type: ActionTypes.REPLACE } as A)
    // change the type of the store by casting it to the new store
    return store as unknown as Store<
      ExtendState<NewState, StateExt>,
      NewActions,
      StateExt,
      Ext
    > &
      Ext
   }

   ```

5. observable

   返回一个 {subscribe} 对象

   重写了 subscribe 对象，observer 参数必须是一个包含 next 方法 的对象

   重写 listener 包含了 observer

   立即执行了 listener,并将 state 传递给 observer.next1

   调用外部 subscribe 将这个 listener 进行注册

   ```TypeScript
    function observable() {
    const outerSubscribe = subscribe
    return {
      /**
       * The minimal observable subscription method.
       * @param observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(observer: unknown) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError(
            `Expected the observer to be an object. Instead, received: '${kindOf(
              observer
            )}'`
          )
        }

        function observeState() {
          const observerAsObserver = observer as Observer<S>
          if (observerAsObserver.next) {
            observerAsObserver.next(getState())
          }
        }

        observeState()
        const unsubscribe = outerSubscribe(observeState)
        return { unsubscribe }
      },

      [$$observable]() {
        return this
      }
    }
   }

   ```

### ApplyMiddleware

```JavaScript
export default function applyMiddleware(
  ...middlewares: Middleware[]
): StoreEnhancer<any> {
  return (createStore: StoreEnhancerStoreCreator) =>
    <S, A extends AnyAction>(
      reducer: Reducer<S, A>,
      preloadedState?: PreloadedState<S>
    ) => {
      const store = createStore(reducer, preloadedState)
      let dispatch: Dispatch = () => {
        throw new Error(
          'Dispatching while constructing your middleware is not allowed. ' +
            'Other middleware would not be applied to this dispatch.'
        )
      }

      const middlewareAPI: MiddlewareAPI = {
        getState: store.getState,
        dispatch: (action, ...args) => dispatch(action, ...args)
      }
      const chain = middlewares.map(middleware => middleware(middlewareAPI))
      dispatch = compose<typeof dispatch>(...chain)(store.dispatch)

      return {
        ...store,
        dispatch
      }
    }
}

```

1. 传入一个中间件列表参数，返回一个 enhancer（接收 createStore 为入参的，返回 store 函数）
2. 对每个 middleware 传入 getState 和 dispatch 参数， 获取到新的 chain 列表
3. 对闭包中间件列表进行 compose 所有的中间件得到一个函数，将 store.dispatch 传如这个函数得到增强函数，
4. 将增强的 dispatch 和 store 合并 返回 新的 store

middleware 都是一下形势

```Javascript
// store 只有getState 和dispatch两个, next形式就是action=>....
const middleware=(store)=> next=> action=>{
      /** */
      next(action);
}

```

compose
上一个函数的参数是下一个函数执行结果 next 且返回一个 ，参数是 next 函数的的函数

```TypeScript
export default function compose(...funcs: Function[]) {
if (funcs.length === 0) {
// infer the argument type so it is usable in inference down the line
return <T>(arg: T) => arg
}

if (funcs.length === 1) {
  return funcs[0]
}

/**  ...args 可以理解为就是一个[next] **/
return funcs.reduce(
(a, b) =>
  (..args) =>
  a(b(...args))
  )
}

```

### combineReducers

就将 reducer 聚合到一个对象上，达到分片处理的目的，合成一个大的 reducer，
每次会遍历这个对象所有 key 值对应的 reducer

得到当前 key 所有的 state，reducer 执行获取当前 key 的 state
并判断当前 state 与之前的是否相等，如果有一个不相等则 hasChange 为 true

遍历完后，判断 ReducerKey 的长度是否与 state 长度相等，如果不等 hasChange 则为 true，

最后 hasChanged 为 true 则 返回 newState 否则返回 原来的 state

```TypeScript
  export default function combineReducers(reducers: ReducersMapObject) {
  const reducerKeys = Object.keys(reducers)
  const finalReducers: ReducersMapObject = {}
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning(`No reducer provided for key "${key}"`)
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers)

  // This is used to make sure we don't warn about the same
  // keys multiple times.
  let unexpectedKeyCache: { [key: string]: true }
  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {}
  }

  let shapeAssertionError: unknown
  try {
    assertReducerShape(finalReducers)
  } catch (e) {
    shapeAssertionError = e
  }

  return function combination(
    state: StateFromReducersMapObject<typeof reducers> = {},
    action: AnyAction
  ) {
    if (shapeAssertionError) {
      throw shapeAssertionError
    }

    if (process.env.NODE_ENV !== 'production') {
      const warningMessage = getUnexpectedStateShapeWarningMessage(
        state,
        finalReducers,
        action,
        unexpectedKeyCache
      )
      if (warningMessage) {
        warning(warningMessage)
      }
    }

    let hasChanged = false
    const nextState: StateFromReducersMapObject<typeof reducers> = {}
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)
      if (typeof nextStateForKey === 'undefined') {
        const actionType = action && action.type
        throw new Error(
          `When called with an action of type ${
            actionType ? `"${String(actionType)}"` : '(unknown type)'
          }, the slice reducer for key "${key}" returned undefined. ` +
            `To ignore an action, you must explicitly return the previous state. ` +
            `If you want this reducer to hold no value, you can return null instead of undefined.`
        )
      }
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    hasChanged =
      hasChanged || finalReducerKeys.length !== Object.keys(state).length
    return hasChanged ? nextState : state
  }
}

```

### bindActionCreates

bindActionCreator
如果是一个函数，和一个 dispatch 则返回一个函数，dispatch(actionCreator)

```TypeScript
function bindActionCreator<A extends AnyAction = AnyAction>(
  actionCreator: ActionCreator<A>,
  dispatch: Dispatch
) {
  return function (this: any, ...args: any[]) {
    return dispatch(actionCreator.apply(this, args))
  }
}
```

如果是一个对象则返回一个对象 每个 key 对应一个 bindActionCreator 执行结果

如果是一个函数 则直接调用 bindActionCreator

```TypeScript
export default function bindActionCreators(
  actionCreators: ActionCreator<any> | ActionCreatorsMapObject,
  dispatch: Dispatch
) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(
      `bindActionCreators expected an object or a function, but instead received: '${kindOf(
        actionCreators
      )}'. ` +
        `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    )
  }

  const boundActionCreators: ActionCreatorsMapObject = {}
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}
```
