import express, { Application, Request, Response } from 'express';
import ioRouter from "./routers/io-router"
import configRouter from './routers/config-router';
import { appConfig } from './config/app-config';
import { loggingMiddleware } from './middlewares/logging-middleware';
import { authenticationMiddleware } from './middlewares/auth-middleware';
import { errorMiddleware } from './middlewares/exception-handler-middleware';
import appLogger from './utilities/logger';
import trackerRouter from './routers/vehicle-router';

const app: Application = express();

//Establish the Middlewares Needed
app.use ( express.json() );
app.use ( loggingMiddleware );
app.use ( authenticationMiddleware );

//Register the Routers
app.use ( "/api/io-controller", ioRouter );
app.use ( "/api/config", configRouter );
app.use ( "/api/trackers", trackerRouter)

/// Link a Middleware to manage all fo the Erros that comes into play
app.use ( errorMiddleware );

//Start Working on things
app.listen(appConfig.port, () => {
  appLogger.info(`${appConfig.appName} is running on port ${appConfig.port}`);
});
