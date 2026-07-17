const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.join(__dirname, ".env"),
});

console.log("Loaded .env from:", path.join(__dirname, ".env"));
console.log(process.env);

require("./config/db"); // Connect to MySQL

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});