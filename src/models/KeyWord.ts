import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const KeyWord = new Schema({
    category: { type: String, required: true },
    magnitude: { type: Number, default: 0 },
    word: { type: String, required: true },
});
export default mongoose.model('KeyWord', KeyWord);
