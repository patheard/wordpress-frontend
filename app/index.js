const config = require("./config");
const createApp = require("./app");

const app = createApp();

app.listen(config.port, () => {
  console.log(`Server: http://localhost:${config.port}`);
  console.log(`WordPress: ${config.wordpress.url}`);
});
