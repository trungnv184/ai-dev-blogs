import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { User } from '../modules/auth/entities/user.entity';

// Load environment variables
dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'personal_website',
  entities: [User],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();

  const email = process.env.ADMIN_EMAIL || 'admin@aidevblogs.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Admin';

  const userRepository = dataSource.getRepository(User);

  // Check if user already exists
  const existingUser = await userRepository.findOne({ where: { email } });

  if (existingUser) {
    console.log(`User with email ${email} already exists.`);
    await dataSource.destroy();
    return;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Insert user
  const user = userRepository.create({
    email,
    passwordHash,
    name,
  });
  await userRepository.save(user);

  console.log('Admin user created successfully!');
  console.log(`  Email: ${email}`);
  console.log(`  Password: ${password}`);

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
