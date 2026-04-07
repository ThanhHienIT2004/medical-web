const { MongoClient } = require('mongodb');

async function fixMongo() {
  const uri = "mongodb://127.0.0.1:27017/?directConnection=true";
  const client = new MongoClient(uri);

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected successfully to server.");

    const db = client.db('admin');
    
    // Check if replica set is already initialized
    try {
      const status = await db.admin().command({ replSetGetStatus: 1 });
      console.log("Replica set status:", status.myState === 1 ? "Primary" : "Other");
    } catch (err) {
      console.log("Replica set not initialized or error:", err.message);
      console.log("Initializing replica set...");
      try {
        const initResult = await db.admin().command({
          replSetInitiate: {
            _id: 'rs0',
            members: [{ _id: 0, host: '127.0.0.1:27017' }]
          }
        });
        console.log("Init result:", initResult);
      } catch (initErr) {
        if (initErr.code === 23) {
          console.log("Replica set already initialized.");
        } else {
          console.error("Init Error:", initErr);
        }
      }
    }
  } finally {
    await client.close();
  }
}

fixMongo().catch(console.dir);
