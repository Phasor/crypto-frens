const mongoose = require("mongoose");
require("dotenv").config();

const devConnection = process.env.DB_STRING;
const prodConnection = process.env.DB_STRING_PROD;

// Connect to the correct environment database
if (process.env.NODE_ENV === "production") {
    mongoose.connect(prodConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.connection.on("connected", () => {
        console.log("Production database connected");
    });
} else if (process.env.NODE_ENV === "development") {
    mongoose.connect(devConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.connection.on("connected", () => {
        console.log("Development database connected");
    });
}
