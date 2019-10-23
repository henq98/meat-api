import mongoose from 'mongoose'

export interface User extends mongoose.Document {
  name: string,
  email: string,
  password: string
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
    required: false,
    enum: ['Male', 'Female']
  }
})

export const User = mongoose.model<User>('User', userSchema)
