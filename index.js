const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB } = require("./db");
const {OpenAIApi, Configuration} = require("openai")

const configuration = new Configuration({
  apiKey: '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',
  basePath: 'https://api.openai.com/v1',
});
const openai = new OpenAIApi(configuration);

const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

app.get("/api/test", function(req, res) {
  console.log('测试接口！')
  res.send("测试接口!")
})

app.get("/api/gpt", async function(req, res) {
  const response = await openai.createCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{role: 'user', content: 'hello'}],
    temperature: 1
  })
  const message = response?.data?.choices[0].message?.content;
  res.send(message);
})

app.get("/api/entry", function(req, res){
  console.log("/api/entry get: " + req)
  res.send("success");
})

//添加post的路由，处理微信服务器转发过来的用户的消息
app.post("/api/entry", function(req, res){
  console.log("/api/entry post: " + req)
})

const port = process.env.PORT || 80;

async function bootstrap() {
  // await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();

