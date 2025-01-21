const { createClient } = require('redis');

const client = createClient({
   url: process.env.REDIS_URL
});

client.on('error', err => console.log('Redis Client Error', err));

const connectRedis = async () => {
   try {
      await client.connect();
      console.log('Connected to Redis successfully!');
   } catch (err) {
      console.log('Redis connection failed',err);
      process.exit(1)
   }
};

const disconnectRedis=async()=>{
   try{
      await client.disconnect();
      console.log('Redis disconnected successfully!');
   }
   catch(err){
      console.log('Failed to disconnect Redis',err);
      
   }
}

module.exports={client,connectRedis,disconnectRedis};