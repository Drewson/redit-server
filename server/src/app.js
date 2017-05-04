import express from 'express'
import { resolve } from 'path'

import fallback from 'express-history-api-fallback';

import config from '../config'

const root = resolve(process.cwd(), config.get('STATIC_PATH'));
const json = require('body-parser').json;
const app = express();
const Pool = require('pg').Pool;
const apiRouter = new express.Router();
const authRouter = new express.Router();

const apiRoutes = require('./routes/api')
const authRoutes = require('./routes/auth')

// app.use(express.static(root));

const pgConfig = {
  user: 'andrewnelson',
  password: 'bridge4',
  database: 'redit',
  post: '5432',
  host: 'localhost'
};

export const pool = new Pool(pgConfig)

app.use(fallback('index.html', { root }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(json())

app.use('/api', apiRoutes(apiRouter))
app.use('/auth', apiRoutes(authRouter))

module.exports = app;
