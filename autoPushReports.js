import { execSync } from "child_process";

try {
  console.log("🔄 Pushing reports to GitHub...");

  execSync("cd playwright-automation-reports && git add .", { stdio: "inherit" });
  execSync('cd playwright-automation-reports && git commit -m "Auto update reports"', { stdio: "inherit" });
  execSync("cd playwright-automation-reports && git push", { stdio: "inherit" });

  console.log("✅ Reports pushed successfully");
} catch (error) {
  console.log("⚠ Nothing new to commit or push failed");
}