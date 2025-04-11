// models/Flat.js
import mongoose from 'mongoose';

const FlatSchema = new mongoose.Schema({
  rent: { type: Number, required: true },
  bond: { type: Number, required: true },
  rooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  address: { type: String, required: true },
  description: { type: String },
  distanceFromUni: { type: String }, // e.g. "10 mins walk" or "2km"
  distanceFromSupermarket: { type: String },
  distanceFromGym: { type: String },
  listed_date: { type: Date, default: Date.now },
});

const Flat = mongoose.models.Flat || mongoose.model('Flat', FlatSchema);

export default Flat;