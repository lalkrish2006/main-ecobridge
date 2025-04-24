const { model } = require("mongoose");
const  collaborationSchema  = require("../schemas/collaborationSchemas");

const Collaboration = model("Collaboration", collaborationSchema);  

module.exports = { Collaboration };  
