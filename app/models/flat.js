import mongoose from 'mongoose';

const FlatSchema = new mongoose.Schema({
  flat_name: { type: String, required: true },
  address: { type: String, required: true },
  location: { type: String, required: true },
  rent_per_week: { type: String, required: true },
  bond: { type: String, required: true },
  rooms: { type: String, required: true },
  available_rooms: { type: String, required: true },
  features: { type: String },
  description: { type: String },
  tags: { type: [String] },
  distance_from_uni: { type: String },
  utilities_included: { type: String },
  images: { type: String }, // consider [String] later
  listed_date: { type: Date, default: Date.now },

  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
});

FlatSchema.index({ coordinates: "2dsphere" });

const Flat = mongoose.models.Flat || mongoose.model('Flat', FlatSchema);

export default Flat;