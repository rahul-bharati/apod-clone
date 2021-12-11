const fs = require("fs");
const https = require("https");

const saveFileToPublic = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const file = fs.createWriteStream(
        `public/images/${url.split("/").pop()}`
      );
      const request = https.get(url, (response) => {
        response.pipe(file).on("finish", () => {
          resolve(url.split("/").pop());
        });
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

checkFileAndCreate = (file_name, remote_url) => {
  return new Promise((resolve, reject) => {
    try {
      fs.exists(`public/images/${file_name}`, async (exists) => {
        if (!exists) {
          await saveFileToPublic(remote_url);
        }
        resolve(true);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  saveFileToPublic,
  checkFileAndCreate,
};
