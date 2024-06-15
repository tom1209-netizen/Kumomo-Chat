import express from 'express';
import connectDB from './config/mongodb.js';
import bodyParser from 'body-parser';
import userRoutes from "./routes/userRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import multer from 'multer';
import cors from 'cors';

const app = express();
const upload = multer();

const corsOptions = {
  origin: "http://localhost:5173",
};

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors(corsOptions));

// Connect Database
connectDB();

// Routes
app.get('/', (req, res) => res.send('API Running'));
app.use('/api/chats', chatRoutes); 
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));