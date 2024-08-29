import { app } from "./application/app";
import { logger } from "./application/logging";

const port = 3000;
app.listen(port, () => {
  logger.info(`Listening on port ${port}`);
});
