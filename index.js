import express from 'express';
import cors from 'cors';
import { configApp as config } from './config/index.js';
import routerBase from './src/index.js';

const app = express();
const port = config.port;
const domain = config.domain;

app.use(cors());

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});

routerBase(app, domain);
