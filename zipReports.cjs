const fs = require('fs');
const archiver = require('archiver');

function zipFolder(source, out) {
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

async function zipReports() {
  await zipFolder('playwright-report', 'playwright-report.zip');
  await zipFolder('allure-report', 'allure-report.zip');
  console.log("Reports zipped successfully ✅");
}

zipReports();