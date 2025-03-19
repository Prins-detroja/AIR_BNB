module.exports = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);  // Catches the error and forwards it to the error-handling middleware
    };
  };
  
  