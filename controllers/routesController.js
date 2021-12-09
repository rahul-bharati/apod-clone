const axios = require("axios");
const moment = require("moment");

const Apod = require("../model/apod");

const renderHome = async (req, res) => {
  const data = {};
  try {
    const date = req.query.date || moment().format("YYYY-MM-DD");
    data.date = date;
    const apod_data = await getApod(date);
    data.apod_data = apod_data;
    if (apod_data.media_type == "video") {
      data.apod_data.isVideo = true;
    }
    data.date = moment(date).format("MMM DD, YYYY");
    res.render("home", data);
  } catch (error) {
    data.error = error;
    console.error(error.msg);
    if (error.msg.toLowerCase().includes("date must be between")) {
      const newDate = moment(error.msg.split("and")[1], "MMM DD, YYYY").format(
        "YYYY-MM-DD"
      );
      data.date = newDate;
    } else if (error.msg.toLowerCase().includes("no data available")) {
      const newDate = moment().subtract(1, "day").format("YYYY-MM-DD");
      data.date = newDate;
    }
    res.render("home", data);
  }
};

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
  renderHome,
};
