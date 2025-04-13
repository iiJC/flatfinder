import React from "react";
import clientPromise from "@/db/database";
import { ObjectId } from "mongodb";
import FlatDetailsClient from "./flatdetailsclient";

export default async function FlatDetailsPage({ params }) {
  // Await params
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return <div>Invalid flat ID</div>;
  }

  const client = await clientPromise;
  const db = client.db("flatfinderdb");
  const flat = await db.collection("flats").findOne({ _id: new ObjectId(id) });

  if (!flat) {
    return <div>Flat not found.</div>;
  }

  return <FlatDetailsClient flat={JSON.parse(JSON.stringify(flat))} />;
}
