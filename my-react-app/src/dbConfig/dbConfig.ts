import mongoose, { mongo } from "mongoose"

export async function  Connect() {
    try{
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;
        connection.on('connected',()=>{
            console.log('MongoDB connected Successfully');
        }
        )
        connection.on('error',(err)=>{
        console.log('MongoDB connection error. Please make sure MOngoDB running'+err);
        process.exit();    
    }
)
    }catch(error){
        console.log('Something goes wrong!');
        console.log(error);
    }
    
}