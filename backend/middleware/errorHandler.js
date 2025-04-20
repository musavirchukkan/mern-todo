// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Log the error
    console.error(`Error: ${err.message}`);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    // Mongoose CastError handling (invalid ObjectId)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).json({
            success: false,
            message: 'Resource not found',
            error: 'Invalid ID format'
        });
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: messages
        });
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate field value entered',
            error: `${Object.keys(err.keyValue)} already exists`
        });
    }

    // JSON Parse Error
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON',
            error: 'Could not parse the request body as JSON'
        });
    }

    // Default Error Response
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
        error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.toString()
    });
};

module.exports = errorHandler;