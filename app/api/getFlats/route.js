// app/api/getFlats/route.js

import { NextResponse } from "next/server";

// You can define mock data here or import it from a JSON file
const mockFlats = [
  {
    _id: "flat1",
    address: "123 Castle Street",
    location: "North Dunedin",
    rent_per_week: 220,
    rooms: 3,
    tags: ["Party", "Furnished"],
    images: "/thumbnailpic.webp"
  },
  {
    _id: "flat2",
    address: "456 Leith Street",
    location: "Central Dunedin",
    rent_per_week: 250,
    rooms: 4,
    tags: ["Quiet", "Fibre internet"],
    images: "/thumbnailpic.webp"
  },
  {
    _id: "flat3",
    address: "789 Cumberland Street",
    location: "Near Uni",
    rent_per_week: 200,
    rooms: 2,
    tags: ["Close to uni", "Power included"],
    images: "/thumbnailpic.webp"
  }
];

export async function GET() {
  return NextResponse.json(mockFlats);
}
