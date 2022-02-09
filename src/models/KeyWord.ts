import mongoose from 'mongoose';
const { Schema } = mongoose;

const KeyWord = new Schema({
    category: String,
    magnitude: Number,
    word: String,
});
export default mongoose.model('KeyWord', KeyWord);
