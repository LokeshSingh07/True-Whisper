import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number 
}


const connection: ConnectionObject = {}


// void means return me kya aa raha h usme mtlb nhi h
async function dbConnect(): Promise<void>{
    // phle connection check krna h ki already connection h ?  == db choking
    if(connection.isConnected){
        console.log("Already connected to database");
        return;
    }

    try{
        const db =  await mongoose.connect(process.env.MONGODB_URI || "", {})

        // console.log("db: ", db);
        // console.log("db connection: ", db.connections);
        connection.isConnected = db.connections[0].readyState;
        console.log("DB connected successfully");
    }
    catch(err){
        console.log("DB connectin failed", err);
        process.exit(1);
    }
}

export default dbConnect;