const express = require("express");
const bodyParser = require("body-parser");
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

app.post("/charge", (req, res) => {
  const amount = 2500;

  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    })
    .then((customer) =>
      stripe.charges.create({
        amount,
        description: "cracking the coding interview",
        currency: "usd",
        customer: customer.id,
      })
    )
    .then((charge) => res.render("success"));
});

app.post("/checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.item.map((item) => {
        const storeItem = store_item.get(item.id);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.amount,
          },
          quantity: item.quantity,
        };
      }),
      success_url: "http://localhost:5000/success",
      cancel_url: "http://localhost:5000/home",
    });
    console.log(session);
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(5000, (req, res) => {
  console.log("app started on port 5000");
});
