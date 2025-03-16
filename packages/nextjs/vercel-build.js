const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Set higher Node.js memory limit
process.env.NODE_OPTIONS = "--max-old-space-size=4096";

// Create error log directory
const errorLogDir = path.join(__dirname, "error-logs");
if (!fs.existsSync(errorLogDir)) {
  fs.mkdirSync(errorLogDir);
}

try {
  console.log("🔧 Setting up environment...");

  // Check if modules are properly installed
  const missingDeps = [
    path.join(__dirname, "node_modules", "react"),
    path.join(__dirname, "node_modules", "autoprefixer"),
    path.join(__dirname, "node_modules", "postcss"),
    path.join(__dirname, "node_modules", "tailwindcss"),
  ].filter((dep) => !fs.existsSync(dep));

  if (missingDeps.length > 0) {
    console.log(
      `📦 Installing dependencies (missing: ${missingDeps
        .map((d) => path.basename(d))
        .join(", ")})...`
    );
    execSync("npm install --no-package-lock", { stdio: "inherit" });

    // Double-check autoprefixer specifically
    if (!fs.existsSync(path.join(__dirname, "node_modules", "autoprefixer"))) {
      console.log("⚠️ Autoprefixer still missing, installing explicitly...");
      execSync(
        "npm install --no-package-lock autoprefixer postcss tailwindcss",
        { stdio: "inherit" }
      );
    }
  }

  // Create optional postinstall marker file
  const postinstallMarker = path.join(
    __dirname,
    "node_modules",
    ".postinstall-complete"
  );
  if (!fs.existsSync(postinstallMarker)) {
    console.log("🔍 Running postinstall script...");
    execSync("npm run postinstall", { stdio: "inherit" });
  }

  // Run actual Next.js build
  console.log("🏗️ Building Next.js app...");
  execSync("next build", { stdio: "inherit" });

  console.log("✅ Build completed successfully");
} catch (error) {
  // Log the error to a file
  const errorLogPath = path.join(errorLogDir, `build-error-${Date.now()}.log`);
  fs.writeFileSync(
    errorLogPath,
    `Build failed at ${new Date().toISOString()}\n\nError:\n${
      error.message
    }\n\nStack:\n${error.stack}`
  );

  console.error("❌ Build failed:", error.message);
  console.error(`Full error log written to ${errorLogPath}`);

  // Exit with error code
  process.exit(1);
}
