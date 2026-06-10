import cors from'cors'
import cookieParser from 'cookie-parser';
import express from 'express'
import authRouter from './routes/auth.routes.js'
import musicRouter from './routes/music.routes.js'
import albumRouter from './routes/album.routes.js'

const app = express();
app.use(cors({
    origin: "http://localhost:5173", // URL of your React app
    credentials: true,              // Crucial for sending cookies (JWT)
}));
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/auth',authRouter);
app.use('/api/v1/music',musicRouter);
app.use('/api/v1/albums', albumRouter);

export { app } 