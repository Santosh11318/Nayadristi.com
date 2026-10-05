import { adminAuth } from "./src/lib/firebase-admin.ts";

async function setup() {
  try {
    const user = await adminAuth.createUser({
      email: "admin@nayadristi.com",
      password: "password123",
      displayName: "Admin User"
    });
    console.log("Successfully created user:", user.uid);
  } catch (error) {
    console.log("Error creating user (might already exist):", error);
  }
}

setup();
