const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for chat message
const chatMessageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,  // Reference to the User model
    ref: 'User',                  // Ensures that the sender is a User
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now           // Automatically set to the current time
  },
  collaborationId: {
    type: Schema.Types.ObjectId,  // Reference to the Collaboration model
    ref: 'Collaboration',         // Links this message to a specific collaboration
    required: true
  }
});

// Create a model for the chat message schema
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;  // Exporting the model
