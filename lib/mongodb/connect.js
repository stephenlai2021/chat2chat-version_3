import mongoose from 'mongoose'

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Mongodb connection successful')
  } catch (error) {
    throw new Error('Error in connecting to mongodb')
  }
}

export default connect