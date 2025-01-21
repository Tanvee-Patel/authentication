const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {connectRedis,disconnectRedis}=require('./models/redis')
const {sendOtp, verifyOtp, resetPassword}=require('./controllers/passwordController')
const app = express();
const {logoutRoute} = require ('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')

if (!process.env.MONGO_URL || !process.env.FRONTEND_URL) {
  console.error('Missing required environment variables. Check your .env file.');
  process.exit(1);
}

const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}))

mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Database not connected:', err);
    process.exit(1);
  });

  connectRedis()
    .catch((err)=>{
    console.error('Redis connection Failed',err);
    process.exit(1)
    
  })

app.use('/', require('./routes/authRoutes'));
// app.use('/logout',logoutRoute)
// app.use('/password', require('./routes/passwordRoutes'));

app.post('/forgot-password/send-otp',sendOtp);
app.post('/forgot-password/verify-otp',verifyOtp);
app.post('/forgot-password/reset-password', resetPassword);

app.use((req, res, next) => {
  res.status(404).json({ message: 'API route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

app.use("/prfile",profileRoutes)

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const shutdown = async () => {
  console.log('Closing server...');
  server.close(() => {
      mongoose.connection.close(() => console.log('MongoDB connection closed'));
      disconnectRedis(() => console.log('Redis connection closed'));
      console.log('Server shutdown complete');
      process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});