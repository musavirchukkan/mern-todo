const mongoose = require('mongoose');

const todoSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            validate: {
                validator: function (v) {
                    return v.trim().length > 0;
                },
                message: 'Title cannot be empty'
            }
        },
        description: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Todo', todoSchema);