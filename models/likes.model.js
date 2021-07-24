const mongoose = require('mongoose')

// Schema
const LikesSchema = new mongoose.Schema({
    ip: [{ type: String, required: true }],
    stockSymbol: { type: String, required: true },
    stockLikes: { type: Number }
})

// Export Model Constructor
module.exports = mongoose.model('Likes', LikesSchema)