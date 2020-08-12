//require("dotenv").config();
import {MongoClient} from "mongodb";
import { Database, User, Listing, Booking } from "../lib/types";

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/test?retryWrites=true&w=majority`;
export const connectDatabase = async (): Promise<Database> => {
    try{

    
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true } );
    const db =  client.db("main");
    return {
        listings:db.collection<Listing>('listings'),
        users:db.collection<User>("users"),
        bookings:db.collection<Booking>("bookings") 
    };
}
catch(error){
    throw new Error(`DB error: ${error}`);
}
};