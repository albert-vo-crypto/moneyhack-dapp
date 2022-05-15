import { log } from "../../utils/commons";

const logger = store => next => action => {
  log("dispatching", action);
  next(action);
};

export default logger;
