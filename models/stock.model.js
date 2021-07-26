const mongoose = require('mongoose')

// Schema
const StockSchema = new mongoose.Schema({
    stock: { type: String, required: true, unique: true },
    ip: [{ type: String }],
    likes: { type: Number }
})

// Export Model Constructor
module.exports = mongoose.model('Stock', StockSchema)