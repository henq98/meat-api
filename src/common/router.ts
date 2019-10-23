import { Server, Response, Next } from 'restify'
import { EventEmitter } from 'events'
import { NotFoundError } from 'restify-errors'

export abstract class Router extends EventEmitter {
  abstract applyRoutes(applitation: Server)

  render (res: Response, next: Next) {
    return (document) => {
      this.emit('beforeRender', document)
      if (document) {
        res.json(document)
      } else {
        throw new NotFoundError('Documento não encontrado')
      }
      return next()
    }
  }
}
