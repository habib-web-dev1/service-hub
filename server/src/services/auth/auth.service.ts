import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../lib/apiError.js";
import { bcryptUtils } from "../../lib/bcrypt.js";
import { jwtUtils } from "../../lib/jwt.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone: string | null;
  role?: "CUSTOMER" | "PROVIDER";
}

interface LoginInput {
  email: string;
  password: string;
}

const register = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const hashedPassword = await bcryptUtils.hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone ?? null,
      role: data.role ?? "CUSTOMER",
    },
  });

  const token = jwtUtils.generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  };
};

const login = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcryptUtils.comparePassword(
    data.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = jwtUtils.generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  };
};

export const authService = {
  register,
  login,
};
