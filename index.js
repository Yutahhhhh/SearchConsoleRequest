const { google } = require('googleapis');
const axios = require('axios');
const xml2js = require('xml2js');
const readline = require('readline');
const fs = require('fs');
const csv = require('csv-parser');

// 検証するサイトマップのURLを設定
const SITEMAP_URL = 'https://example/sitemap.xml';

function readUrlsFromCsv(filePath) {
  return new Promise((resolve, reject) => {
    const urls = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        urls.push(row.URL);
      })
      .on('end', () => {
        resolve(urls);
      })
      .on('error', reject);
  });
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function getUrlsFromSitemap() {
  try {
    const response = await axios.get(SITEMAP_URL);
    const result = await xml2js.parseStringPromise(response.data);
    const urls = result.urlset.url.map(u => u.loc[0]);
    return urls;
  } catch (error) {
    console.error(`Error fetching or parsing sitemap: ${error}`);
    return [];
  }
}

async function main() {
  const excludeUrls = await readUrlsFromCsv('./files/excludes.csv');
  const urls = await getUrlsFromSitemap();
  const filteredUrls = urls.filter(url => !excludeUrls.includes(url));

  const auth = new google.auth.GoogleAuth({
    keyFile: './files/service-account.json',
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const client = await auth.getClient();

  const indexing = google.indexing({
    version: 'v3',
    auth: client,
  });

  filteredUrls.forEach(url => console.log(url));
  const answer = await askQuestion("これらのURLを登録しますか？ (yes/no): ");

  if (answer.toLowerCase() === 'yes') {
    for (const url of urls) {
      try {
        const response = await indexing.urlNotifications.publish({
          requestBody: {
            url: url,
            type: 'URL_UPDATED',
          },
        });
        console.log(`Response for ${url}:`, response.data);
      } catch (error) {
        console.error(`API returned an error for ${url}:`, error);
      }
    }
  } else {
    console.log("処理はキャンセルされました。");
  }
}

main().catch(console.error);
