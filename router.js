import mcache from "memory-cache";
import { authIdMiddleware } from "./middlwares/auth-id-middleware.js";
import { createLead } from "./routes/user/create-lead.js";
import { sendOTP } from "./routes/send-otp.js";
import { verifyOTP } from "./routes/verify-otp.js";

const cache = (duration) => {
  return (req, res, next) => {
    let key = "__express__" + req.originalUrl || req.url;
    let cachedBody = mcache.get(key);
    if (cachedBody) {
      res.setHeader("content-type", "application/json");
      res.send(JSON.parse(cachedBody));
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        mcache.put(key, JSON.stringify(body), duration * 1000);
        res.setHeader("content-type", "application/json");

        res.sendResponse(body);
      };
      next();
    }
  };
};

export default (app) => {
  app.get("/favicon.ico", (req, res) => res.status(204));
  app.post(`/user/send-otp`, sendOTP);
  app.post(`/user/verify-otp`, verifyOTP);
  app.post(`/user/create-lead`, authIdMiddleware, createLead);
  app.get(`/check-health`, (req, res) => {
    return res.send("Working");
  });
};
