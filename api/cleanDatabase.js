import mongoose from "mongoose";

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/mydb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Get all collection names
    return mongoose.connection.db.listCollections().toArray();
  })
  .then(async (collections) => {
    // Iterate over collections and drop them
    for (let collection of collections) {
      await mongoose.connection.db.dropCollection(collection.name);
      console.log(`Dropped collection: ${collection.name}`);
    }
    console.log("Database cleared");
  })
  .catch((err) => {
    console.error("Error clearing database:", err);
  })
  .finally(() => {
    mongoose.disconnect();
  });
