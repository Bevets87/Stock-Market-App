import mongoose from 'mongoose'
const Schema = mongoose.Schema

const stockSchema = new Schema({
  name: String
})

const Stock = mongoose.model('stock', stockSchema)

export default Stock
