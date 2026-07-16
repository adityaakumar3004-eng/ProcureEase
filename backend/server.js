const dotenv = require("dotenv");
dotenv.config();

require("./config/db"); // Connect to MySQL

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});