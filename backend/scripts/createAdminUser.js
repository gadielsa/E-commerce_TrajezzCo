import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Dados do admin
    const adminData = {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: process.env.ADMIN_ROLE || 'admin'
    };

    if (!adminData.name || !adminData.email || !adminData.password) {
      throw new Error('Defina ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD no ambiente antes de executar.');
    }

    // Verificar se admin já existe
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️  Admin já existe com este email!');
      if (existingAdmin.role === 'admin') {
        console.log(`📧 Email: ${existingAdmin.email}`);
        console.log(`👤 Nome: ${existingAdmin.name}`);
      }
      await mongoose.connection.close();
      return;
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Criar admin
    const admin = await User.create({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('\n📋 Dados de acesso:');
    console.log(`📧 Email: ${admin.email}`);
    console.log('🔐 Senha: (oculta, definida em ADMIN_PASSWORD)');
    console.log(`👤 Nome: ${admin.name}`);
    console.log(`🔑 Role: ${admin.role}`);
    console.log(`📱 ID: ${admin._id}`);
    console.log('\n⚠️  GUARDE ESSES DADOS COM SEGURANÇA!');
    console.log('⚠️  Altere a senha assim que fizer login!\n');

    await mongoose.connection.close();
    console.log('🔌 Conexão fechada');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
};

createAdminUser();
