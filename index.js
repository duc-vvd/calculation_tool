import db from "./helper/db.js";
import { readAllFile } from "./file-handler/index.js";

try {
  await readAllFile();
} catch (error) {
  console.error(`main - catch error: ${error.message}`);
}
