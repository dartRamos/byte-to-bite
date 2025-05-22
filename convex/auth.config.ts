export default {
  providers: [
    {
      domain: process.env.CLERK_FRONTEND_API_URL,
      applicationID: "convex",
    },
  ]
};

console.log("CLERK URL in auth.config.ts:", process.env.CLERK_FRONTEND_API_URL);