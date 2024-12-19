module.exports = {
  apps: [
    {
      name: "partFront", // Nom de l'application pour PM2
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production", // Définit l'environnement en production
      },
    },
  ],
};
