import { configApp as config } from '../config/index.js';
import { FILE_PATH } from './enum.js';

export const INPUT_FILE_PATH = config.file_path.input || FILE_PATH.INPUT;

export const OUTPUT_FILE_PATH = config.file_path.output || FILE_PATH.OUTPUT;

export const TEMP_FILE_PATH = config.file_path.temp || FILE_PATH.TEMP;
