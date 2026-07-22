import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export const registerUser = async (userData) => {
  const { username, email, password } = userData;

  // 1. Validate input
  if (!username || !email || !password) {
    throw new Error("All fields are required");
  }

  // 2. Check if email already exists
  const existingEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingEmail) {
    throw new Error("Email already exists");
  }

  // 3. Check if username already exists
  const existingUsername = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUsername) {
    throw new Error("Username already exists");
  }

  // 4. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5. Create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  // 6. Return safe response
  return {
    success: true,
    message: "User registered successfully",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};