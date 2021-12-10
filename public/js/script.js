(() => {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!
  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  today = yyyy + "-" + mm + "-" + dd;
  document.getElementById("date").setAttribute("max", today);

  if (date) {
    today = new Date(date);
    dd = today.getDate();
    mm = today.getMonth() + 1; //January is 0!
    yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    today = yyyy + "-" + mm + "-" + dd;
    document.getElementById("date").setAttribute("value", today);
  }

  // document.getElementById("date").addEventListener("keydown", () => false);

  document.getElementById("date").addEventListener("change", () => {
    document.getElementById("form").submit();
  });
})();
