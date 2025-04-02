const { connectToDatabase } = require('../../db/database');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const flatsCollection = db.collection('flats');

      const flatData = req.body;
      const result = await flatsCollection.insertOne(flatData);

      res.status(201).json({ message: 'Flat added successfully!', result });
    } catch (error) {
      console.error('Error adding flat:', error);
      res.status(500).json({ message: 'Failed to add flat.', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}