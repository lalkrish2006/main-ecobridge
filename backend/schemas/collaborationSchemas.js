const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./UserSchema');

// Define the collaboration schema
const collaborationSchema = new Schema({
  title: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  sdgs: [{ 
    type: String 
  }],
  createdBy: { 
    type: Schema.Types.ObjectId,  // Changed to ObjectId since it's a reference
    ref: 'User', 
    required: true 
  },
  members: [{
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }],
  environmentalImpact: { 
    type: Number, 
    required: true, 
    min: 1, // Ensure values are between 1 and 10
    max: 10, // Ensure values are between 1 and 10
    default: 1 
  },
  socialImpact: { 
    type: Number, 
    required: true, 
    min: 1, // Ensure values are between 1 and 10
    max: 10, // Ensure values are between 1 and 10
    default: 1 
  },
  economicImpact: { 
    type: Number, 
    required: true, 
    min: 1, // Ensure values are between 1 and 10
    max: 10, // Ensure values are between 1 and 10
    default: 1 
  },
  greenScore: { 
    type: Number, 
    required: true, 
    default: 1 
  },
});

// Add a method to calculate the green score based on the input values
collaborationSchema.methods.calculateGreenScore = function() {
  // Apply equal weightage to each factor, assuming all are between 1 and 10
  const greenScore = (this.environmentalImpact + this.socialImpact + this.economicImpact) / 3;
  this.greenScore = greenScore;
};

// Apply the calculation before saving the document
collaborationSchema.pre('save', function(next) {
  this.calculateGreenScore();
  next();
});

module.exports = collaborationSchema;
