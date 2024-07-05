const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')


const vendorRoutes = require('./routes/vendorRoutes')
const firmRoutes = require('./routes/firmRoutes')
const productRoutes =require('./routes/productRoutes')

const app = express();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server Started at Port ${PORT}`);
});

dotenv.config();
app.use(cors())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected"))
  .catch((error) => console.log(error));

app.use(bodyParser.json())
app.use('/vendor', vendorRoutes)
app.use('/firm', firmRoutes)
app.use('/product', productRoutes)
app.use('/uploads', express.static('uploads'))

app.use("/", (req, res) => {
  res.send("<h1> Welcome </h1>");
});