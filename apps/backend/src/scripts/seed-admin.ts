import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'personal_website',
  entities: [],
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();

  const email = process.env.ADMIN_EMAIL || 'admin@aidevblogs.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Admin';

  // Check if user already exists
  const existingUser = await dataSource.query(
    'SELECT * FROM users WHERE email = $1',
    [email],
  );

  if (existingUser.length > 0) {
    console.log(`User with email ${email} already exists.`);
    await dataSource.destroy();
    return;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Insert user
  await dataSource.query(
    `INSERT INTO users (id, email, "passwordHash", name, "createdAt", "updatedAt")
     VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())`,
    [email, passwordHash, name],
  );

  console.log('Admin user created successfully!');
  console.log(`  Email: ${email}`);
  console.log(`  Password: ${password}`);
  console.log('\nYou can now login at http://localhost:5173/admin');

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
