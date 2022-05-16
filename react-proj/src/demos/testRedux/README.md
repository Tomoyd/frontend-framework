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
