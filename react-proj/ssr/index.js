const express = require("express");
const React = require("react");
const { renderToString } = require("react-dom/server");
require("node-jsx").install();
const Home = require("./views/Home");

const app = express();

const content = renderToString(React.createElement(Home));
app.use(express.static("dist"));
app.use("/", (req, res) => {
  res.send(`
        <html>
        <body>
            <div id="root">
            ${content}
            </div>
           
            <script src="/index.js"></script>
        </body>    
        </html>
    `);
});

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
});
