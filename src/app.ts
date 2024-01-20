import express, { Application } from 'express';
import ioRouter from "./routers/io-router"
import configRouter from './routers/config-router';
import { appConfig } from './config/app-config';
import { loggingMiddleware } from './middlewares/logging-middleware';
import { authenticationMiddleware } from './middlewares/auth-middleware';
import { errorMiddleware } from './middlewares/exception-handler-middleware';
import trackerRouter from './routers/vehicle-router';
import appLogger from './lib/logger';
import testingRouter from './routers/hik-testinging-router';
import formidable from 'express-formidable';
const app: Application = express();

//Establish the Middlewares Needed
app.use ( express.json({limit: '10mb'}) );
app.use ( loggingMiddleware );
app.use(formidable());

app.use ( "/api/hikvision/testing", testingRouter );

//app.use ( authenticationMiddleware );

//Register the Routers
//app.use ( "/api/io-controller", ioRouter );
//app.use ( "/api/config", configRouter );
//app.use ( "/api/trackers", trackerRouter)

/// Link a Middleware to manage all fo the Erros that comes into play
app.use ( errorMiddleware );

//Start Working on things
app.listen(appConfig.port, () => {
  appLogger.info(`${appConfig.appName} is running on port ${appConfig.port}`);
});
