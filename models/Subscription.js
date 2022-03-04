const mongoose = require("mongoose");
const moment = require("moment");

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  sname: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  Save: {
    type: Number,
    required: true,
  },
  finalPrice: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    default: moment().format("Do MMMM YYYY"),
  },
  exp_date: {
    type: String,
  },
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
