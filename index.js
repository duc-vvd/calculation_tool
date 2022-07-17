import db from "./helper/db.js";
import { readAllFile } from "./file-handler/index.js";
import { calRRAO } from "./calculate/index.js";

try {
  await readAllFile();
  const RRAO = calRRAO();
  console.log("============= DONE =============");
} catch (error) {
  console.error(`main - catch error: ${error.message}`);
}
