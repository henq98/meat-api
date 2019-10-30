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
      const user = new User(req.body)

      user.save()
        .then(this.render(res, next))
        .catch(next)
    })

    application.put('/users/:id', (req, res, next) => {
      const { id } = req.params

      const options = { new: true, runValidators: true }

      User.findByIdAndUpdate({ _id: id }, req.body, options)
        .then(result => {
          if (result) {
            return result
          } else {
            throw new NotFoundError('Documento não encontrado')
          }
        }).then(this.render(res, next))
        .catch(next)
    })

    application.del('/users/:id', (req, res, next) => {
      User.findByIdAndRemove({ _id: req.params.id })
        .then(result => {
          if (result) {
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
