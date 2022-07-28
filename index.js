import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import routerBase from './src/index.js';

const app = express();
const port = 3000;
const domain = 'api';

app.use(cors());

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});

routerBase(app, domain);
