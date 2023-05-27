const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
require("dotenv").config();
const stripe = require("stripe")(process.env.stripe_secret_key);

const cors = require("cors");
const app = express();

app.set("view engine", "ejs");
app.set("views", "./client/views");
app.use(express.static("./client/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.get("/", (req, res) => {
  res.render("index");
});

const store_item = new Map([
  [1, { amount: 10000, name: "cracking the coding interview" }],
]);
console.log(store_item);
app.get("/home", (req, res) => {
  res.render("index2");
});
app.get("/success", (req, res) => {
  res.render("success");
});

app.post("/api/proxy", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer CHASECK_TEST-qwhjXzUtpwRj9tVuc2VuOWXFJMMzqlIF",
          redirect: "follow",
        },

        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    console.log("server sends ", data);
    res.json({ data });
  } catch (error) {
    console.error("Error occurred while making the API request:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/verification", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.chapa.co/v1/transaction/verify/" + req.query.id,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer CHASECK_TEST-qwhjXzUtpwRj9tVuc2VuOWXFJMMzqlIF",
        },
      }
    );

    const data = await response.json();
    res.render("success", { data: data });
    console.log(data);
  } catch (error) {
    console.error("verification fetch error", error);
  }
});

app.listen(5000, (req, res) => {
  console.log("app started on port 5000");
});
