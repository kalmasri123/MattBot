import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Response = new Schema({
    sentence: { type: String, required: true },
    category: { type: String, required: true },
});
export default mongoose.model('Response', Response);
