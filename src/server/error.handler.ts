import { Request, Response } from 'restify'

export const handleError = (req: Request, res: Response, err, done) => {
  err.toJSON = (): ErrorEventInit => {
    return {
      message: err.message
    }
  }

  switch (err.name) {
    case 'MongoError':
      (err.code === 11000) ? err.statusCode = 400 : err.statusCode = 500
      break
    case 'ValidationError':
      err.statusCode = 400
      break
  }

  done()
}
