import '../config/env'; // validate env vars first — must be before any other import
import { connectDB } from '../config/db';
import { env } from '../config/env';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

async function seedAdmin(): Promise<void> {
  await connectDB();

  const existing = await User.findOne({ email: env.ADMIN_EMAIL.toLowerCase() });

  if (existing) {
    console.log(`ℹ️  Admin already exists: ${env.ADMIN_EMAIL}`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(env.ADMIN_PASSWORD, SALT_ROUNDS);

  await User.create({
    firstName: env.ADMIN_FIRST_NAME,
    lastName: env.ADMIN_LAST_NAME,
    email: env.ADMIN_EMAIL.toLowerCase(),
    password: hashedPassword,
    role: 'admin',
    status: 'active',
    access: 'edit',
    emailVerificationToken: null,
    emailVerificationExpires: null,
  });

  console.log(`✅ Admin created: ${env.ADMIN_EMAIL}`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
