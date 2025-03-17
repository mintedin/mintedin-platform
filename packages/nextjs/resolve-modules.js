const fs = require("fs");
const path = require("path");

console.log("🔄 Setting up module resolution symlinks...");

// Create directories if they don't exist
const nodeModulesPath = path.join(__dirname, "node_modules");
const atPath = path.join(nodeModulesPath, "@");

try {
  if (!fs.existsSync(nodeModulesPath)) {
    console.log("📁 Creating node_modules directory...");
    fs.mkdirSync(nodeModulesPath, { recursive: true });
  }

  if (!fs.existsSync(atPath)) {
    console.log("📁 Creating @ directory in node_modules...");
    fs.mkdirSync(atPath, { recursive: true });
  }

  // Define directories to symlink
  const dirsToLink = [
    { name: "components", path: path.join(__dirname, "components") },
    { name: "lib", path: path.join(__dirname, "lib") },
    { name: "utils", path: path.join(__dirname, "utils") },
    { name: "app", path: path.join(__dirname, "app") },
    { name: "styles", path: path.join(__dirname, "styles") },
    { name: "public", path: path.join(__dirname, "public") },
  ];

  // Create symlinks
  dirsToLink.forEach((dir) => {
    const symlinkPath = path.join(atPath, dir.name);

    // Remove existing symlink if it exists
    try {
      if (fs.existsSync(symlinkPath)) {
        const stats = fs.lstatSync(symlinkPath);
        if (stats.isSymbolicLink() || stats.isDirectory()) {
          console.log(`🗑️ Removing existing ${dir.name} symlink...`);
          fs.rmSync(symlinkPath, { recursive: true, force: true });
        }
      }
    } catch (err) {
      console.error(
        `❌ Error removing existing symlink for ${dir.name}:`,
        err.message
      );
    }

    // Create the symlink if the source directory exists
    if (fs.existsSync(dir.path)) {
      try {
        // Use relative path for symlink to avoid absolute path issues
        const relativePath = path.relative(path.dirname(symlinkPath), dir.path);
        fs.symlinkSync(relativePath, symlinkPath, "junction");
        console.log(`✅ Successfully set up symlink for @/${dir.name}`);
      } catch (err) {
        console.error(
          `❌ Error creating symlink for ${dir.name}:`,
          err.message
        );
      }
    } else {
      console.log(`⚠️ Directory ${dir.name} does not exist, skipping symlink`);
    }
  });

  console.log("✅ Module resolution setup complete!");
} catch (err) {
  console.error("❌ Error setting up module resolution:", err);
  process.exit(1);
}
