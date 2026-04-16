/**
 * Deploys Playwright + Allure reports to GitHub Pages.
 * Creates report-deploy folder, copies both reports, pushes to gh-pages branch.
 * The same URL always shows the latest report (each run overwrites previous).
 */
import fs from "fs-extra";
import { join, resolve } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import ghpages from "gh-pages";
import simpleGit from "simple-git";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = resolve(__dirname);
const deployDir = join(projectRoot, "report-deploy");
const allureResultsDir = join(projectRoot, "allure-results");
const playwrightReportSrc = join(projectRoot, "playwright-report");

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Playwright Automation Reports</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 40px; background: #0d1117; color: #c9d1d9; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    h1 { font-size: 2rem; margin-bottom: 8px; }
    .subtitle { color: #8b949e; margin-bottom: 32px; }
    .links { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
    a { display: inline-block; padding: 14px 28px; background: #238636; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; transition: background 0.2s; }
    a:hover { background: #2ea043; }
    a.secondary { background: #21262d; border: 1px solid #30363d; }
    a.secondary:hover { background: #30363d; }
  </style>
</head>
<body>
  <h1>Playwright Automation Reports</h1>
  <p class="subtitle">Latest test run • Updated on each run</p>
  <div class="links">
    <a href="./playwright-report/index.html">Playwright Report</a>
    <a href="./allure-report/index.html" class="secondary">Allure Report</a>
  </div>
</body>
</html>`;

async function getRepoUrl() {
  try {
    const git = simpleGit({ baseDir: projectRoot });
    const url = await git.raw(["config", "--get", "remote.origin.url"]);
    const repo = (url || "").trim();
    if (repo) {
      // gh-pages needs HTTPS URL with .git
      if (repo.startsWith("git@github.com:")) {
        return "https://github.com/" + repo.replace("git@github.com:", "").replace(".git", "") + ".git";
      }
      return repo.endsWith(".git") ? repo : repo + ".git";
    }
  } catch {
    // Not a git repo or no remote
  }
  return null;
}

async function deploy() {
  console.log("📦 Preparing reports for deployment...");

  // Clean and create deploy dir
  if (fs.existsSync(deployDir)) fs.rmSync(deployDir, { recursive: true });
  fs.mkdirSync(deployDir, { recursive: true });

  // Copy Playwright report
  if (fs.existsSync(playwrightReportSrc)) {
    fs.copySync(playwrightReportSrc, join(deployDir, "playwright-report"));
    console.log("  ✓ Playwright report copied");
  } else {
    console.warn("  ⚠ Playwright report not found. Run tests first.");
  }

  // Generate Allure report from isolated copy (exclude history to avoid merging old runs)
  if (fs.existsSync(allureResultsDir)) {
    const isolatedResults = join(deployDir, "allure-results-temp");
    fs.mkdirSync(isolatedResults, { recursive: true });
    const files = fs.readdirSync(allureResultsDir);
    for (const f of files) {
      if (f === "history") continue; // Skip history to prevent merging previous runs
      const src = join(allureResultsDir, f);
      const dest = join(isolatedResults, f);
      if (fs.statSync(src).isFile()) fs.copyFileSync(src, dest);
    }
    execSync(`npx allure generate "${isolatedResults}" -o "${join(deployDir, "allure-report")}" --clean`, {
      stdio: "inherit",
      cwd: projectRoot,
    });
    fs.rmSync(isolatedResults, { recursive: true, force: true });
    console.log("  ✓ Allure report generated (latest run only)");
  } else {
    console.warn("  ⚠ allure-results not found. Run tests first.");
  }

  fs.writeFileSync(join(deployDir, "index.html"), indexHtml);

  const hasReports = fs.existsSync(join(deployDir, "playwright-report")) || fs.existsSync(join(deployDir, "allure-report"));
  if (!hasReports) {
    console.error("\n❌ No reports to deploy. Run tests first.");
    process.exit(1);
  }

  let repoUrl = await getRepoUrl() || process.env.GITHUB_REPO;
  if (repoUrl && !repoUrl.endsWith(".git")) repoUrl = repoUrl + ".git";
  if (!repoUrl) {
    console.error("\n❌ Cannot deploy: No git remote or GITHUB_REPO env variable.");
    console.log("   Fix: Initialize git, add a remote, or set GITHUB_REPO=https://github.com/username/repo.git");
    process.exit(1);
  }

  console.log("🚀 Deploying to GitHub Pages...");
  return new Promise((resolve, reject) => {
    ghpages.publish(
      deployDir,
      {
        repo: repoUrl,
        branch: "gh-pages",
        dotfiles: true,
        message: "Update reports - " + new Date().toISOString(),
      },
      (err) => {
        if (err) {
          console.error("❌ Deploy failed:", err.message);
          reject(err);
        } else {
          const base = repoUrl.replace(/https?:\/\/github\.com\//, "").replace(/\.git$/, "");
          const [user, repo] = base.split("/");
          const pagesUrl = user && repo ? `https://${user}.github.io/${repo}/` : "";
          console.log("\n✅ Reports deployed to GitHub Pages!");
          if (pagesUrl) console.log("   🔗 " + pagesUrl);
          // Send email with report link (skip if SEND_EMAIL=0)
          if (pagesUrl && process.env.SEND_EMAIL !== "0") {
            try {
              execSync("node sendReportEmail.js", {
                stdio: "inherit",
                cwd: projectRoot,
                env: { ...process.env, REPORT_URL: pagesUrl },
              });
            } catch {
              console.warn("   ⚠ Email not sent (check .env: EMAIL_USER, EMAIL_PASS, EMAIL_TO)");
            }
          }
          resolve();
        }
      }
    );
  });
}

deploy().catch(() => process.exit(1));
