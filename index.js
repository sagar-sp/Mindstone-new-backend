const connectToMongo = require("./config/config");
const express = require("express");
const cors = require("cors");
connectToMongo();
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/stratergies", require("./routes/stratergies.js"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
