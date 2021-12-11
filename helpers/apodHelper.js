const axios = require("axios");
const Apod = require("../model/apod");
const fileHelper = require("./fileHelper");

const getApod = (date) => {
  return new Promise(async (resolve, reject) => {
    try {
      let apod = await Apod.findOne({ date: date });
      if (!apod) {
        apod = await createApod(date);
      }
      if (apod.media_type == "image") {
        await fileHelper.checkFileAndCreate(apod.hdurl, apod.remoteUrl);
      }
      resolve(apod.toObject());
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

const createApod = (date) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await fetchApodFromNasa(date);
      if (data.media_type == "image") {
        const fileUrl = await fileHelper.saveFileToPublic(data.hdurl);
        data.remoteUrl = data.hdurl;
        data.hdurl = fileUrl;
      }
      const apodDoc = new Apod(data);
      const apod = await apodDoc.save();
      resolve(apod);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

const fetchApodFromNasa = (date) => {
  return new Promise(async (resolve, reject) => {
    try {
      const nasa_api = `https://api.nasa.gov/planetary/apod?api_key=${process.env.APIKEY}&date=${date}`;
      const response = await axios(nasa_api);
      const data = response.data;
      resolve(data);
    } catch (error) {
      console.error(error);
      reject(error.response.data);
    }
  });
};

module.exports = {
  getApod,
  createApod,
  fetchApodFromNasa,
};
