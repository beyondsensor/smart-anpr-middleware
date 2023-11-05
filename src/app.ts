import express, { Application, Request, Response } from 'express';
import ioRouter from "./router/io-router"
import eventRouter from './router/event-router';
import { appConfig } from './config/app-config';
import { loggingMiddleware } from './middlewares/logging-middleware';
import { authenticationMiddleware } from './middlewares/auth-middleware';
import { errorMiddleware } from './middlewares/exception-handler-middleware';

const app: Application = express();

//Establish the Middlewares Needed
app.use ( express.json() );
app.use ( loggingMiddleware );
app.use ( authenticationMiddleware );

//Register the Routers
app.use ( "/api/io", ioRouter );
app.use ( "/api/event", eventRouter );

/// Link a Middleware to manage all fo the Erros that comes into play
app.use ( errorMiddleware );

//Start Working on things
app.listen(appConfig.port, () => {
  console.log(`[${new Date().toISOString()}] ${appConfig.appName} is running on port ${appConfig.port}`);
});
