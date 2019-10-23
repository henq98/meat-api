import restify from 'restify'
import mongoose, { Mongoose } from 'mongoose'

import { Router } from '../common/router'
import { environment } from '../common/environment'
import { handleError } from './error.handler'

export class Server {
  application: restify.Server;

  initializeDb (): Promise<Mongoose> {
    return mongoose.connect(environment.db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      authSource: 'admin'
    })
  }

  initRoutes (routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = restify.createServer({
          name: 'meat-api',
          version: '1.0.0'
        })

        this.application.use(restify.plugins.bodyParser())
        this.application.use(restify.plugins.queryParser())

        for (const router of routers) {
          router.applyRoutes(this.application)
        }

        this.application.listen(environment.server.port, () => {
          resolve(this.application)
        })

        this.application.on('restifyError', handleError)
      } catch (err) {
        reject(err)
      }
    })
  }

  bootstrap (routers: Router[] = []): Promise<Server> {
    return this.initializeDb().then(() => this.initRoutes(routers).then(() => this))
  }
}
