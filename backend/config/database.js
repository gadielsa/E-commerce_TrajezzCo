import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Opções do Mongoose 8+
      // useNewUrlParser e useUnifiedTopology não são mais necessários
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Evento de desconexão
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB desconectado');
    });

    // Evento de erro após conexão inicial
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erro no MongoDB:', err);
    });

  } catch (error) {
    console.error('❌ Erro ao conectar no MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
