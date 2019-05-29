var express = require("express");
var config = require("./config");
var axios = require("axios");

app = express();
var router = express.Router();

router.get("/a", (req, res) => {
  res.send("hello");
});

router.get("/api/getTopList", function(req, res) {
  let url = "https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg";
  axios
    .get(url, {
      headers: {
        referer: "https://m.y.qq.com",
        origin: "https://m.y.qq.com"
      },
      params: req.query
    })
    .then(response => {
      res.json(response.data);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/api/getDiscList", function(req, res) {
  var url = "https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg";
  axios
    .get(url, {
      headers: {
        referer: "https://c.y.qq.com/",
        host: "c.y.qq.com"
      },
      params: req.query
    })
    .then(response => {
      res.json(response.data);
    })
    .catch(e => {
      console.log(e);
    });
});

router.get("/api/getSongList", function(req, res) {
  const url = "https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg";
  axios
    .get(url, {
      headers: {
        referer: "https://c.y.qq.com/",
        host: "c.y.qq.com"
      },
      params: req.query
    })
    .then(response => {
      let ret = response.data;
      if (typeof ret === "string") {
        const reg = /^\w+\(({.+})\)$/;
        const matches = ret.match(reg);
        if (matches) {
          ret = JSON.parse(matches[1]);
        }
      }
      res.json(ret);
    })
    .catch(e => {
      console.log(e);
    });
});

router.get("/api/lyric", function(req, res) {
  const url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg";

  axios
    .get(url, {
      headers: {
        referer: "https://c.y.qq.com/",
        host: "c.y.qq.com"
      },
      params: req.query
    })
    .then(response => {
      let ret = response.data;
      if (typeof ret === "string") {
        const reg = /^\w+\(({.+})\)$/;
        const matches = ret.match(reg);
        if (matches) {
          ret = JSON.parse(matches[1]);
        }
      }
      res.json(ret);
    })
    .catch(e => {
      console.log(e);
    });
});

router.get("/api/getHotKey", function(req, res) {
  const url = "https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg";
  axios
    .get(url, {
      headers: {
        referer: "https://y.qq.com/m/index.html",
        origin: "https://y.qq.com"
      },
      params: req.query
    })
    .then(response => {
      res.json(response.data);
    })
    .catch(e => {
      console.log(e);
    });
});

router.get("/api/search", function(req, res) {
  const url = "https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp";
  axios
    .get(url, {
      headers: {
        referer: "https://y.qq.com/m/index.html",
        origin: "https://y.qq.com"
      },
      params: req.query
    })
    .then(response => {
      res.json(response.data);
    })
    .catch(e => {
      console.log(e);
    });
});

app.use("/", router);
app.use(express.static("./dist"));

var port = process.env.PORT || config.build.port;

module.exports = app.listen(port, function(err) {
  if (err) {
    console.log(err);
  }
  console.log("listening at http://localhost" + port);
});
