import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const mongoConnection = async () => {
    try {
        const mongoUrl = process.env.MONGO_KEY;  
        if (!mongoUrl) {
            throw new Error("La variable MONGO_KEY no está definida");
        }
        await mongoose.connect(mongoUrl, { dbName: "Mercado" });
        console.log("Base de datos conectada");
    } catch (e) {
        console.error("Error al conectar la base de datos", e.message);
    }
};

  

