import restify from 'restify'
import { NotFoundError } from 'restify-errors'

import { Router } from '../common/router'
import { User } from './users.model'

class UsersRouter extends Router {
  constructor () {
    super()
    this.on('beforeRender', document => {
      document.password = undefined
    })
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  applyRoutes (application: restify.Server) {
    application.get('/users', (req, res, next) => {
      User.find()
        .then(this.render(res, next))
        .catch(next)
    })

    application.get('/users/:id', (req, res, next) => {
      User.findById(req.params.id)
        .then(this.render(res, next))
        .catch(next)
    })

    application.post('/users', (req, res, next) => {
      const { name, email, password } = req.body
      const user = new User({ name, email, password })

      user.save()
        .then(this.render(res, next))
        .catch(next)
    })

    application.put('/users/:id', (req, res, next) => {
      const { id } = req.params

      User.updateOne({ _id: id }, req.body)
        .exec()
        .then(result => {
          if (result.n) {
            return User.findById(id)
          } else {
            throw new NotFoundError('Documento não encontrado')
          }
        }).then(this.render(res, next))
        .catch(next)
    })

    application.del('/users/:id', (req, res, next) => {
      User.deleteOne({ _id: req.params.id })
        .exec()
        .then(result => {
          if (result.deletedCount) {
            res.send(204)
          } else {
            throw new NotFoundError('Documento não encontrado')
          }
          return next()
        })
        .catch(next)
    })
  }
}

export const usersRouter = new UsersRouter()
