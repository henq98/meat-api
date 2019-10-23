import * as restify from 'restify';

export abstract class Router {
  abstract applyRoutes(applitation: restify.Server)
}