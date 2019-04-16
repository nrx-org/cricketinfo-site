// const express = require("express");
const next = require("next");
const https = require("https");
const fs = require("fs");
const { parse } = require("url");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    // const server = express();

    // server.get("/wiki/:lang/:articleId", (req, res) => {
    //   const actualPage = "/article";

    //   const queryParams = {
    //     articleId: req.params.articleId,
    //     lang: req.params.lang
    //   };

    //   app.render(req, res, actualPage, queryParams);
    // });

    // server.get("*", (req, res) => {
    //   return handle(req, res);
    // });

    https
      .createServer(
        {
          key: fs.readFileSync("local-cert-generator/server.key"),
          cert: fs.readFileSync("local-cert-generator/server.crt")
        },
        (req, res) => {
          const parsedUrl = parse(req.url, true);
          handle(req, res, parsedUrl);
        }
      )
      .listen(3000, err => {
        if (err) throw err;
        console.log("Listening with https on 443");
      });

    // server.listen(3000, err => {
    //   if (err) throw err;
    //   // eslint-disable-next-line no-console
    //   console.log("> Ready on http://localhost:3000/");
    // });
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error(err.stack);
    process.exit(1);
  });
