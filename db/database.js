// lib/mongodb.js
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://main-db:find123find@flatfinderdb.jaurqtl.mongodb.net/?retryWrites=true&w=majority&appName=flatfinderdb";

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

let client;
let clientPromise;

// Create a MongoClient instance and connect to the database
client = new MongoClient(uri, options);
clientPromise = client.connect();

module.exports = clientPromise;