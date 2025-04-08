const mongoose = require("mongoose");

const shoppingBagSchema = new mongoose.Schema({
  userID: {
    type: Number,
    ref: "User",
    default: null,
    required: false,
  },
  userUUID: {
    type: String,
    default: null,
    required: false,
  },
  jewelry: {
    type: Number,
    ref: "Jewelry",
    required: true,
  },
  size: {
    type: Number,
    ref: "Size",
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const shoppingBag = mongoose.model("ShoppingBag", shoppingBagSchema);

module.exports = shoppingBag;
