const logger = store => next => action => {
  console.log("dispatching", action);
  next(action);
};

export default logger;
