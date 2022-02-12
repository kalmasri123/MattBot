import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SpecialWord = new Schema({
    phrase: { type: String, required: true },
    category: { type: String, required: true },
});
export default mongoose.model('SpecialWord', SpecialWord);
