import { app } from "./app";
import { config } from "@/infrastructure/config";

const port = config.port();

app.listen(port, () => {
  console.log(`Engine listening on http://localhost:${port}`);
});
