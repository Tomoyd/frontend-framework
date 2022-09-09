// @ts-nocheck
import React from 'react';

const Form = React.memo(
  (props) => {
    return (
      // @ts-ignore
      <form method='post' onSubmit={props.submitForm}>
        <p>
          <input
            defaultValue={props.defaultValue}
            type='text'
            name='username'
            onChange={
              // @ts-ignore
              props.changeUsername
            }
          />
          {Date.now()}

          {/* <input type='submit' disabled={!this.state.isValid} /> */}
        </p>
      </form>
    );
  },
  (pre, next) => true
);

class Uncontrolled extends React.Component {
  state = {
    username: '',
    isValid: false,
  };

  changeUsername = (e) => {
    const { value } = e.target;
    this.setState(() => ({
      username: value,
      isValid: value.length > 3,
    }));
  };

  submitForm = (e) => {
    e.preventDefault();
    alert(`Hello ${this.state.username}`);
  };

  render() {
    return (
      <>
        <p>Your username: {this.state.username}</p>
        <Form
          defaultValue={this.state.username}
          changeUsername={this.changeUsername}
          submitForm={this.submitForm}
        />
      </>
    );
  }
}

export default Uncontrolled;
