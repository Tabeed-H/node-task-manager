const app = require("./main");
const PORT = process.env.PORT;
// Starting up server
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Server running on PORT ${PORT}`);
});
