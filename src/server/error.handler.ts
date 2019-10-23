import { Request, Response } from 'restify'

export const handleError = (req: Request, res: Response, err, done) => {
  err.toJSON = (): ErrorEventInit => {
    return {
      message: err.message
    }
  }
  const messages: any[] = []

  switch (err.name) {
    case 'MongoError':
      (err.code === 11000) ? err.statusCode = 400 : err.statusCode = 500
      break
    case 'ValidationError':
      err.statusCode = 400
      for (const name in err.errors) {
        messages.push({ messages: err.errors[name].message })
      }
      err.toJSON = () => ({
        errors: messages
      })
      break
  }

  done()
}
