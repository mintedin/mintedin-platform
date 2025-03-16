#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("📦 Checking if all CSS processing dependencies are installed...");

// List of dependencies we need for Next.js CSS processing
const requiredDeps = ["autoprefixer", "postcss", "tailwindcss"];

// Check if any are missing
const missingDeps = requiredDeps.filter((dep) => {
  try {
    return !fs.existsSync(path.join(__dirname, "node_modules", dep));
  } catch (e) {
    return true;
  }
});

// Install any missing dependencies
if (missingDeps.length > 0) {
  console.log(`Installing missing CSS dependencies: ${missingDeps.join(", ")}`);

  try {
    execSync(`npm install --no-save ${missingDeps.join(" ")}`, {
      stdio: "inherit",
      cwd: __dirname,
    });
    console.log("✅ CSS dependencies successfully installed");
  } catch (error) {
    console.error("❌ Failed to install CSS dependencies:", error.message);
    process.exit(1);
  }
} else {
  console.log("✅ All CSS dependencies already installed");
}

// Create a marker file to indicate successful completion
fs.writeFileSync(
  path.join(__dirname, "node_modules", ".css-deps-installed"),
  `Installed on ${new Date().toISOString()}`
);
