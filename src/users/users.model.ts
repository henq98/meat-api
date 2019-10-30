import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

import { validateCPF } from '../common/validators'
import { environment } from '../common/environment'
export interface User extends mongoose.Document {
  name: string,
  email: string,
  password: string,
  sex: string,
  cpf: string
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 80,
    minlength: 3
  },
  email: {
    type: String,
    match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  sex: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  cpf: {
    type: String,
    validate: {
      validator: validateCPF,
      msg: '{PATH}: Invalid CPF ({VALUE})'
    }
  }
})

const hashPassword = (obj, next) => {
  bcrypt.hash(obj.password, environment.security.saltRounds)
    .then(hash => {
      obj.password = hash
      next()
    }).catch(next)
}

const saveMiddleware = function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user: User = this
  if (!user.isModified('password')) {
    next()
  } else {
    hashPassword(user, next)
  }
}

const updateMiddleware = function (next) {
  if (!this.getUpdate().password) {
    next()
  } else {
    hashPassword(this.getUpdate(), next)
  }
}

userSchema.pre('save', saveMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)
userSchema.pre('update', updateMiddleware)

export const User = mongoose.model<User>('User', userSchema)
