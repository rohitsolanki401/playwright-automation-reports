import { execSync } from "child_process";

const args = process.argv.slice(2).join(" ");

if (!args) {
  console.log("❌ Please provide test file and options");
  process.exit(1);
}

try {
  console.log(`🚀 Running: npx playwright test ${args}`);

  execSync(`npx playwright test ${args}`, { stdio: "inherit" });

  console.log("📤 Pushing reports...");
  execSync("node autoPushReports.js", { stdio: "inherit" });

  console.log("📧 Sending email...");
  execSync("node sendEmail.js", { stdio: "inherit" });

  console.log("✅ Done successfully!");
} catch (error) {
  console.log("❌ Something failed.");
}