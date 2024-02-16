const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(express.json());
app.use(cors());

// Your routes will go here
app.post("/createUser", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await admin.auth().createUser({ email, password });
    res.status(200).send({ uid: user.uid });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// lists all users
app.get("/listUsers", async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers(1000);
    const users = listUsersResult.users.map((user) => user.toJSON());
    console.log(users);
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
