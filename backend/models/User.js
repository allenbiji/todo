const mongoose = require("mongoose");

// Define the schema for the users collection
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: "users" }
); // Explicitly set the collection name to 'users'

// Export the model, and Mongoose will now use the 'users' collection in MongoDB
module.exports = mongoose.model("User", userSchema);
