import React, { Component } from "react";

// 属性代理,可以劫持props做一些内容操作,   抽象state
// 高阶组件符合函数式编程思想，对于源组件来说并不会感受到高阶组件的存在，只是把功能加在它之上，
// 混合对组件来说是感知的，容易混乱且不易维护
export const MyContainer = (WrapperComponent) => {
  return class extends Component {
    render() {
      return (
        <WrapperComponent
          {...this.props}
          content='PropProxyComponent'
          ref={(ref) => {
            console.log("ref", ref);
          }}
        ></WrapperComponent>
      );
    }
  };
};

// 反向继承
/**
 *
 * 渲染劫持，可以通过supper 去获取被包裹组件的渲染render
 * 控制state，一般情况下应避免加state
 *
 *
 *
 */

export const InheritanceInversion = (WrappedComponent) => {
  return class extends WrappedComponent {
    static displayName = "InheritanceInversion" + WrappedComponent.displayName;
    render() {
      return (
        <div>
          {super.render()}
          <div>{"InheritanceInversion" + WrappedComponent.displayName}</div>
        </div>
      );
    }
  };
};

// 组件参数，可以传入参数返回一个高级组件

// HOCFactory(params)(WrappedComponent) ->@HOCFactory(params)

export const HOCFactory = (params) => {
  return function HOC(WrappedComponent) {
    return class extends WrappedComponent {
      render() {
        return params.name ? super.render() : "无";
      }
    };
  };
};

export class MyComponent extends Component {
  static displayName = "MyComponent";
  render() {
    return <div>{this.props.content}</div>;
  }
}

export const PropProxyComponent = MyContainer(MyComponent);
export const InheritanceInversionComponent = InheritanceInversion(MyComponent);
export const HOCWithParams = HOCFactory({ name: 12344 })(MyComponent);
export default MyContainer(MyComponent);
