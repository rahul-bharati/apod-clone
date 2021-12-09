const axios = require("axios");
const Apod = require("../model/apod");
const fileHelper = require("./fileHelper");

const getApod = async (date) => {
  return new Promise(async (resolve, reject) => {
    try {
      const apod = await Apod.findOne({ date: date });
      if (!apod) {
        const createdApod = await createApod(date);
        resolve(createdApod.toObject());
      }
      resolve(apod.toObject());
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

const createApod = async (date) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await fetchApodFromNasa(date);
      if (data.media_type == "image") {
        const fileUrl = await fileHelper.saveFileToPublic(data.hdurl);
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

const fetchApodFromNasa = async (date) => {
  return new Promise(async (resolve, reject) => {
    try {
      const nasa_api = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${date}`;
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
