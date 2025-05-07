const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "dist")));

// Handle client-side routing
app.get("*", (req, res, next) => {
  // Check if the request is for a static file
  if (req.path.includes(".")) {
    return next();
  }

  // For all other routes, serve the index.html
  res.sendFile(path.join(__dirname, "dist", "index.html"), (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Error loading the application");
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
