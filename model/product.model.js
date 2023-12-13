const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    productName: { type: String },
    qty: { type: Number },
    price: { type: Number },
    mangDate: { type: String },
});

const ProductModel = mongoose.model("Product", ProductSchema, "products");
module.exports = ProductModel