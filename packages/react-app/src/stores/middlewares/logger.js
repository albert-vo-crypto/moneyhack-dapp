import { log } from "../../utils/commons";

const logger = store => next => action => {
  log("dispatching", action?.type, action);
  next(action);
};

export default logger;
