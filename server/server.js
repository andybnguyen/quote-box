const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const fetch = require("node-fetch");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//get new random color palette from colormind API
function getColor() {
  return fetch("http://colormind.io/api/", {
    method: "POST",
    body: JSON.stringify({ model: "default" })
  })
    .then(response => response.json())
    .then(data => {
      //sort result by color palette from the highest saturation to lightest
      const result = data.result.sort((a, b) => {
        return a.reduce((x, y) => x + y) - b.reduce((x, y) => x + y);
      });
      return result;
    })
    .catch(err => console.log(err));
}

getColor();
//get new random quote from quotesondesign API
function getQuote() {
  return fetch(
    "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1"
  )
    .then(res => res.json())
    .then(data => {
      return data[0];
    })
    .catch(err => console.log(err));
}

//second route to when client click submit to get new quote
app.get("/get-quote", (req, res) => {
  Promise.all([getColor(), getQuote()]).then(values => {
    res.send({ data: values });
  });
});

//console.log  that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
