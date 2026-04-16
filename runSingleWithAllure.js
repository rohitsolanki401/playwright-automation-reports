import { execSync } from "child_process";
import { rmSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

// Use forward slashes so Playwright regex matching works (backslashes cause "No tests found")
const rawArgs = process.argv.slice(2).filter((a) => a !== "--no-deploy");
const args = rawArgs
  .map((arg) => (arg.includes("\\") && !arg.startsWith("-") ? arg.replace(/\\/g, "/") : arg))
  .join(" ");

if (!args) {
  console.log("Usage: npm run test:single:allure -- <test-file> [options]");
  console.log("Example: npm run test:single:allure -- \"tests/Reports/view-report.smoke.spec.js\" --project=chromium --headed");
  process.exit(1);
}

// Clear previous results so reports contain only this run
const allureResultsDir = join(process.cwd(), "allure-results");
const playwrightReportDir = join(process.cwd(), "playwright-report");
if (existsSync(allureResultsDir)) rmSync(allureResultsDir, { recursive: true });
if (existsSync(playwrightReportDir)) rmSync(playwrightReportDir, { recursive: true });
mkdirSync(allureResultsDir, { recursive: true });

try {
  console.log(`🚀 Running: npx playwright test ${args}`);
  execSync(`npx playwright test ${args}`, { stdio: "inherit" });
} catch {
  // Continue to generate report even if tests fail
}

console.log("📊 Generating Allure report...");
execSync("npx allure generate allure-results -o ../playwright-automation-reports/allure-report --clean", { stdio: "inherit" });
console.log("✅ Report generated.");

// Deploy to GitHub Pages (skip with --no-deploy)
const skipDeploy = process.argv.includes("--no-deploy");
if (!skipDeploy) {
  console.log("\n🌐 Deploying to GitHub Pages...");
  try {
    execSync("node deploy-report.js", { stdio: "inherit" });
  } catch {
    console.error("Deploy failed. Ensure git is initialized and remote is set. Skip deploy with --no-deploy");
  }
} else {
  console.log("   Run locally: npm run allure:open");
}
