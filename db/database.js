const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://rimmerfinn:find123find@flatfinderdb.jaurqtl.mongodb.net/?retryWrites=true&w=majority&appName=flatfinderdb";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    if (!client.isConnected) {
      await client.connect();
      console.log("Connected to MongoDB!");
    }
    return client.db("flatfinderdb"); // Replace with your database name
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

module.exports = { client, connectToDatabase };