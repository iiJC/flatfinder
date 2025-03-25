// TODO - setup mongodb vvv 
// import clientPromise from "@/lib/mongodb";

export async function generateStaticParams() {     // TODO replace with real data later
    const flatIds = ['flat1', 'flat2', 'flat3'];
  
    return flatIds.map((id) => ({
      id,
    }));
  }
  
export default function FlatDetailsPage({ params }) {
    const { id } = params;
  
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Flat Details</h2>
        <p className="text-lg">You're viewing flat: <strong>{id}</strong></p>
      </div>
    );
  }