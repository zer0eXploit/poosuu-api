import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), "/config", ".env") });
