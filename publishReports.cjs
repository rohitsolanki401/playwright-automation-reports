const simpleGit = require('simple-git');
const fs = require('fs-extra');

const git = simpleGit();

async function publish() {
  try {
    // Clone report repo into temp folder
    await git.clone('https://github.com/rohitsolanki401/playwright-automation-reports.git', 'reports-temp');

    // Remove old content
    await fs.emptyDir('reports-temp');

    // Copy new reports
    await fs.copy('playwright-report', 'reports-temp/playwright-report');
    await fs.copy('allure-report', 'reports-temp/allure-report');

    const gitTemp = simpleGit('reports-temp');

    await gitTemp.add('.');
    await gitTemp.commit('Updated automation reports');
    await gitTemp.push('origin', 'main');

    console.log('Reports published to GitHub ✅');

  } catch (err) {
    console.error(err);
  }
}

publish();