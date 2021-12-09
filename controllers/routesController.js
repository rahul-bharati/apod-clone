const moment = require("moment");
const apodHelper = require("../helpers/apodHelper");

const renderHome = async (req, res) => {
  const data = {};
  try {
    const date = req.query.date || moment().format("YYYY-MM-DD");
    data.date = date;
    const apod_data = await apodHelper.getApod(date);
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

module.exports = {
  renderHome,
};
