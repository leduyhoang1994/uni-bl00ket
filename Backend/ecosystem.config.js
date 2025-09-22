// Backend/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "backend-app",
      script: "build/Backend/src/app.js",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false, 
    },
  ],
};
