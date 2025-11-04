import mongoose from 'mongoose';

const dictionaryEntrySchema = new mongoose.Schema({
  originalTerm: {
    type: String,
    required: true,
    unique: true,
  },
  simplifiedTerm: {
    type: String,
    required: true,
  },
});

const DictionaryEntry = mongoose.model('DictionaryEntry', dictionaryEntrySchema);

export default DictionaryEntry;