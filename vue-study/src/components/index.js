import form from "./form";
import other from "./other";

export default {
  install: (app) => {
    app.use(form);
    app.use(other);
  },
};
