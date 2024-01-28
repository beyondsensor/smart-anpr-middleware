import express, { Application } from 'express';
import ioRouter from "./routers/io-router"
import configRouter from './routers/config-router';
import { appConfig } from './config/app-config';
import { loggingMiddleware } from './middlewares/logging-middleware';
import { authenticationMiddleware } from './middlewares/auth-middleware';
import { errorMiddleware } from './middlewares/exception-handler-middleware';
import appLogger from './lib/logger';
import hikCctvRouter from './routers/hik-camera-router';
import attendanceWorkflowRouter from './routers/event-router';
const app: Application = express();

//Establish the Middlewares Needed
app.use ( express.json({limit: '10mb'}) );
app.use ( loggingMiddleware );

//Register the Routers
//app.use ( "/api/io-controller", ioRouter );
app.use ( "/api/config", configRouter );
//app.use ( "/api/trackers", trackerRouter)
app.use ( "/api/hikvision", hikCctvRouter);
app.use ( "/api/workflows/attendance-taking/", attendanceWorkflowRouter)
/// Link a Middleware to manage all fo the Erros that comes into play
app.use ( errorMiddleware );

//Start Working on things
app.listen(appConfig.port, () => {
  appLogger.info(`${appConfig.appName} is running on port ${appConfig.port}`);
});
