const mongoose = require('mongoose');

const todoSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
            minlength: [2, 'Title must be at least 2 characters'],
            validate: {
                validator: function (v) {
                    return v.trim().length > 0;
                },
                message: 'Title cannot be empty'
            }
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot be more than 500 characters']
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ['pending', 'in-progress', 'completed'],
                message: '{VALUE} is not a valid status'
            },
            default: 'pending'
        },
        priority: {
            type: String,
            enum: {
                values: ['low', 'medium', 'high'],
                message: '{VALUE} is not a valid priority'
            },
            default: 'medium'
        },
        completed: {
            type: Boolean,
            default: false
        },
        dueDate: {
            type: Date,
            validate: {
                validator: function (value) {
                    // Date validation is optional
                    return !value || value >= new Date();
                },
                message: 'Due date cannot be in the past'
            }
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtuals
todoSchema.virtual('isOverdue').get(function () {
    if (this.dueDate && !this.completed) {
        return new Date() > this.dueDate;
    }
    return false;
});

// Pre-save middleware
todoSchema.pre('save', function (next) {
    // Set completed to true when status is 'completed'
    if (this.status === 'completed') {
        this.completed = true;
    } else {
        this.completed = false;
    }
    next();
});

// Indexes for better query performance
todoSchema.index({ status: 1 });
todoSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Todo', todoSchema);