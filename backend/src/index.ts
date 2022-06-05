import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
// Supertoken imports
import supertokens from "supertokens-node";
import { errorHandler, middleware } from "supertokens-node/framework/express";
import { configureBucket } from './cloud-storage/cloud-config';
import supertokensConfig from './config/supertokens-config';
import likeRouter from "./routes/api/like";
import postRouter from "./routes/api/post";
import userRouter from './routes/api/user';

async function main() {
    const app = express();

    // Connect to mongoose
    const dbOptions: mongoose.ConnectOptions = {
        dbName: process.env.DATABASE_NAME
    }
    try {
        await mongoose.connect(process.env.DATABASE_URI_LOCAL!, dbOptions);
    }catch(e) {
        console.log("Error connecting to DB: " + e);
    }

    // Supertokens
    supertokens.init(supertokensConfig);

    // cors config options
    // TODO: Add remote client url here
    const allowedOrigins = ['http://localhost:3000']
    const options: cors.CorsOptions = {
        origin: allowedOrigins,
        allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
        credentials: true,
    };
    
    // Configure Bucket
    configureBucket(allowedOrigins);

    // Add middleware
    app.use(cors(options));
    app.use(express.json());
    app.use(middleware());

    // Error handling supertokens
    app.use(errorHandler());
    
    // Add all our routes
    app.use("/api/post", postRouter)
    app.use("/api/user", userRouter);
     app.use("/api/likes", likeRouter);
    
    app.listen(process.env.PORT, () => {
        console.log(`Barker listening at http://localhost:${process.env.PORT}`);
    });
}

main();