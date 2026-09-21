export const cookieOptions = {
  httpOnly: true,
  // Fix Issue 2: Only require secure cookies in production (allows localhost HTTP testing)
  secure: process.env.NODE_ENV === "production", 
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Fix Issue 1: Make this a function so it evaluates at runtime, not startup
export const getVerificationExpirationTime = () => new Date(Date.now() + 10 * 60 * 1000);