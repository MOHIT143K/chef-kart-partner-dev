import mcache from "memory-cache";
import { authIdMiddleware } from "./middlwares/auth-id-middleware.js";
import { createLead } from "./routes/user/create-lead.js";
import { sendOTP } from "./routes/auth/send-otp.js";
import { verifyOTP } from "./routes/auth/verify-otp.js";
import { updateUser } from "./routes/user/update-user.js";
import { updateProfilePic } from "./routes/user/update-profile-pic.js";
import { addBankAccount } from "./routes/user/add-bank-account.js";
import { updateBankAccount } from "./routes/user/update-bank-account.js";
import { deleteBankAccount } from "./routes/user/delete-back-account.js";
import { updateLead } from "./routes/user/update-lead.js";

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
  app.post(`/user/update-lead`, authIdMiddleware, updateLead);
  app.post("/user/update-user", authIdMiddleware, updateUser);
  app.post("/user/update-profile-pic", authIdMiddleware, updateProfilePic);
  app.post("/user/add-bank-account", authIdMiddleware, addBankAccount);
  app.post("/user/update-bank-account", authIdMiddleware, updateBankAccount);
  app.delete("/user/delete-bank-account", authIdMiddleware, deleteBankAccount);
  app.get(`/check-health`, (req, res) => {
    return res.send("Working");
  });
};
