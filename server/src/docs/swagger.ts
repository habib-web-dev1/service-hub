import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ServiceHub API",
      version: "1.0.0",
      description:
        "REST API for the ServiceHub platform — booking local service professionals.",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            phone: { type: "string", nullable: true },
            role: { type: "string", enum: ["CUSTOMER", "PROVIDER", "ADMIN"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            slug: { type: "string" },
            description: { type: "string", nullable: true },
          },
        },
        Service: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            duration: { type: "integer", nullable: true },
            isActive: { type: "boolean" },
            categoryId: { type: "string" },
            providerId: { type: "string" },
            category: { $ref: "#/components/schemas/Category" },
            provider: { $ref: "#/components/schemas/User" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Booking: {
          type: "object",
          properties: {
            id: { type: "string" },
            serviceId: { type: "string" },
            customerId: { type: "string" },
            status: {
              type: "string",
              enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
            },
            scheduledAt: { type: "string", format: "date-time" },
            notes: { type: "string", nullable: true },
            service: { $ref: "#/components/schemas/Service" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Review: {
          type: "object",
          properties: {
            id: { type: "string" },
            bookingId: { type: "string" },
            serviceId: { type: "string" },
            userId: { type: "string" },
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: {},
          },
        },
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errors: {},
          },
        },
      },
    },
    paths: {
      // ─── AUTH ────────────────────────────────────────────────
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: { type: "string", minLength: 2, maxLength: 100 },
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 8 },
                    phone: { type: "string" },
                    role: {
                      type: "string",
                      enum: ["CUSTOMER", "PROVIDER"],
                      default: "CUSTOMER",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Registration successful",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        properties: {
                          data: {
                            type: "object",
                            properties: {
                              user: { $ref: "#/components/schemas/User" },
                              token: { type: "string" },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            409: { description: "Email already in use" },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login with email and password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ApiResponse" },
                      {
                        properties: {
                          data: {
                            type: "object",
                            properties: {
                              user: { $ref: "#/components/schemas/User" },
                              token: { type: "string" },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            401: { description: "Invalid credentials" },
          },
        },
      },

      // ─── USERS ───────────────────────────────────────────────
      "/users/me": {
        get: {
          tags: ["Users"],
          summary: "Get current authenticated user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "User profile" },
            401: { description: "Unauthorized" },
          },
        },
        patch: {
          tags: ["Users"],
          summary: "Update name / phone",
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", minLength: 2, maxLength: 100 },
                    phone: { type: "string", nullable: true },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Updated user" },
          },
        },
        delete: {
          tags: ["Users"],
          summary: "Soft-delete own account",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Account deleted" },
          },
        },
      },
      "/users/me/password": {
        patch: {
          tags: ["Users"],
          summary: "Change password",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["currentPassword", "newPassword"],
                  properties: {
                    currentPassword: { type: "string" },
                    newPassword: { type: "string", minLength: 8 },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Password changed" },
            400: { description: "Current password incorrect" },
          },
        },
      },
      "/users/me/become-provider": {
        post: {
          tags: ["Users"],
          summary: "Upgrade CUSTOMER account to PROVIDER",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Role updated to PROVIDER" },
          },
        },
      },
      "/users": {
        get: {
          tags: ["Users"],
          summary: "Admin: list all users (paginated)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 10 },
            },
          ],
          responses: {
            200: { description: "Paginated users list" },
            403: { description: "Admin only" },
          },
        },
      },
      "/users/{id}": {
        delete: {
          tags: ["Users"],
          summary: "Admin: soft-delete a user by ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "User deleted" },
            403: { description: "Admin only" },
          },
        },
      },

      // ─── CATEGORIES ──────────────────────────────────────────
      "/categories": {
        get: {
          tags: ["Categories"],
          summary: "List all categories",
          responses: {
            200: { description: "Array of categories" },
          },
        },
        post: {
          tags: ["Categories"],
          summary: "Admin: create a new category",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "slug"],
                  properties: {
                    name: { type: "string" },
                    slug: { type: "string" },
                    description: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Category created" },
          },
        },
      },
      "/categories/{id}": {
        get: {
          tags: ["Categories"],
          summary: "Get category by ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Category object" } },
        },
        patch: {
          tags: ["Categories"],
          summary: "Admin: update category",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Updated category" } },
        },
        delete: {
          tags: ["Categories"],
          summary: "Admin: soft-delete category",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Category deleted" } },
        },
      },
      "/categories/{id}/restore": {
        patch: {
          tags: ["Categories"],
          summary: "Admin: restore a soft-deleted category",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Category restored" } },
        },
      },

      // ─── SERVICES ────────────────────────────────────────────
      "/services": {
        get: {
          tags: ["Services"],
          summary: "List active services (filterable)",
          parameters: [
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "categoryId", in: "query", schema: { type: "string" } },
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 10 },
            },
          ],
          responses: { 200: { description: "Paginated services" } },
        },
        post: {
          tags: ["Services"],
          summary: "Provider: create a new service",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "title",
                    "description",
                    "price",
                    "categoryId",
                    "providerId",
                  ],
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    price: { type: "number" },
                    duration: { type: "integer" },
                    categoryId: { type: "string" },
                    providerId: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Service created" } },
        },
      },
      "/services/my": {
        get: {
          tags: ["Services"],
          summary: "Provider: list own services",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Provider services" } },
        },
      },
      "/services/{id}": {
        get: {
          tags: ["Services"],
          summary: "Get service by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Service object" } },
        },
        patch: {
          tags: ["Services"],
          summary: "Provider: update a service",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Updated service" } },
        },
        delete: {
          tags: ["Services"],
          summary: "Provider: soft-delete a service",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Service deleted" } },
        },
      },

      // ─── BOOKINGS ────────────────────────────────────────────
      "/bookings": {
        get: {
          tags: ["Bookings"],
          summary: "Admin: get all bookings",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 20 },
            },
          ],
          responses: { 200: { description: "Paginated bookings" } },
        },
        post: {
          tags: ["Bookings"],
          summary: "Customer: create a booking",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["serviceId", "scheduledAt"],
                  properties: {
                    serviceId: { type: "string" },
                    scheduledAt: { type: "string", format: "date-time" },
                    notes: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Booking created" } },
        },
      },
      "/bookings/my": {
        get: {
          tags: ["Bookings"],
          summary: "Customer: get own bookings",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Customer bookings" } },
        },
      },
      "/bookings/provider": {
        get: {
          tags: ["Bookings"],
          summary: "Provider: get bookings for own services",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Provider bookings" } },
        },
      },
      "/bookings/{id}": {
        get: {
          tags: ["Bookings"],
          summary: "Get a single booking by ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Booking object" } },
        },
      },
      "/bookings/{id}/status": {
        patch: {
          tags: ["Bookings"],
          summary: "Update booking status (provider / admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
                    },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Status updated" } },
        },
      },
      "/bookings/{id}/cancel": {
        patch: {
          tags: ["Bookings"],
          summary: "Customer: cancel a booking",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Booking cancelled" } },
        },
      },

      // ─── REVIEWS ─────────────────────────────────────────────
      "/reviews": {
        post: {
          tags: ["Reviews"],
          summary: "Customer: submit a review for a completed booking",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["bookingId", "serviceId", "rating"],
                  properties: {
                    bookingId: { type: "string" },
                    serviceId: { type: "string" },
                    rating: { type: "integer", minimum: 1, maximum: 5 },
                    comment: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Review submitted" } },
        },
      },
      "/reviews/service/{serviceId}": {
        get: {
          tags: ["Reviews"],
          summary: "Get all reviews for a service",
          parameters: [
            {
              name: "serviceId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Array of reviews" } },
        },
      },
      "/reviews/{id}": {
        get: {
          tags: ["Reviews"],
          summary: "Get a single review by ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Review object" } },
        },
        patch: {
          tags: ["Reviews"],
          summary: "Customer: update own review",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    rating: { type: "integer", minimum: 1, maximum: 5 },
                    comment: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Review updated" } },
        },
        delete: {
          tags: ["Reviews"],
          summary: "Delete a review (owner or admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Review deleted" } },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};
