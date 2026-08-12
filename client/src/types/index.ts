export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string | number;
  duration: number | null;
  categoryId: string;
  providerId: string;
  isActive: boolean;
  category?: Category;
  provider?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  scheduledAt: string;
  notes: string | null;
  service?: Service;
  createdAt: string;
  updatedAt: string;
}
