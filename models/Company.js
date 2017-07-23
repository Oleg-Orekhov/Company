var mongoose = require('mongoose');

module.exports = mongoose.model('Company',{
    name: String,
    earnings: Number,
    allEarnings: Number,
    parentId: {type: mongoose.Schema.ObjectId, ref: 'Company'}
});