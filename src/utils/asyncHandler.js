// if an asynchronous function throws an error,
//  you need to explicitly pass that error to the next
//  function for the Express error-handling middleware to catch it.
//  without this, your server might crash or not handle the error properly.

const asyncHandler = (requestHandler) => {
    (req,res,next) => {
        Promise
            .resolve(requestHandler(req,res,next))
            .reject((error) => next(error))
    }
};

export { asyncHandler };
