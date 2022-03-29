const React = require("react");

const Home = () => {
  return (
    <div>
      <div>This is home222</div>
      <button
        onClick={() => {
          alert("666");
        }}
      >
        click
      </button>
    </div>
  );
};

module.exports = Home;
