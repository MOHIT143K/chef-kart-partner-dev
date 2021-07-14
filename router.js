import mcache from "memory-cache";
import { authIdMiddleware } from "./middlwares/auth-id-middleware.js";
import { createLead } from "./routes/user/create-lead.js";
import { sendOTP } from "./routes/auth/send-otp.js";
import { verifyOTP } from "./routes/auth/verify-otp.js";
import { updateUser } from "./routes/user/update-user.js";
import { updateProfilePic } from "./routes/user/update-profile-pic.js";
import { getBankAccounts } from "./routes/user/get-bank-accounts.js";
import { addBankAccount } from "./routes/user/add-bank-account.js";
import { updateBankAccount } from "./routes/user/update-bank-account.js";
import { deleteBankAccount } from "./routes/user/delete-back-account.js";
import { updateLead } from "./routes/user/update-lead.js";
import { fetchUser } from "./routes/user/fetch-user.js";
import { updateMobileNo } from "./routes/user/update-mobile-no.js";
import { updateDefaultBankAccount } from "./routes/user/update-default-bank-account.js";
import { getLeads } from "./routes/user/get-leads.js";
import { adminLogin } from "./routes/auth/admin-login.js";
import { fetchDashboard } from "./routes/admin/fetch-dashboard.js";
import { adminGetLeads } from "./routes/admin/get-leads.js";
import { adminUpdateLead } from "./routes/admin/update-lead.js";
import { adminDeleteLead } from "./routes/admin/delete-lead.js";
import { adminGetLeadFullDetails } from "./routes/admin/get-lead-full-details.js";

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
  app.get(`/check-health`, (req, res) => {
    return res.send("Working");
  });

  app.post(`/user/send-otp`, sendOTP);
  app.post(`/user/verify-otp`, verifyOTP);
  app.get(`/user/fetch-user`, authIdMiddleware, fetchUser);
  app.get(`/user/get-leads`, authIdMiddleware, getLeads);
  app.post(`/user/create-lead`, authIdMiddleware, createLead);
  app.post(`/user/update-lead`, authIdMiddleware, updateLead);

  app.post("/user/update-user", authIdMiddleware, updateUser);
  app.post("/user/update-profile-pic", authIdMiddleware, updateProfilePic);
  app.post("/user/update-mobile-no", authIdMiddleware, updateMobileNo);

  app.get("/user/get-bank-accounts", authIdMiddleware, getBankAccounts);
  app.post("/user/add-bank-account", authIdMiddleware, addBankAccount);
  app.post("/user/update-bank-account", authIdMiddleware, updateBankAccount);
  app.delete("/user/delete-bank-account", authIdMiddleware, deleteBankAccount);
  app.post(
    "/user/update-default-bank-account",
    authIdMiddleware,
    updateDefaultBankAccount
  );

  app.post("/auth/admin-login", adminLogin);
  app.post("/admin/fetch-dashboard", authIdMiddleware, fetchDashboard);
  app.post("/admin/get-leads", authIdMiddleware, adminGetLeads);
  app.post("/admin/get-lead-full-details", authIdMiddleware, adminGetLeadFullDetails);
  app.post("/admin/update-leads", authIdMiddleware, adminUpdateLead);
  app.delete("/admin/delete-lead", authIdMiddleware, adminDeleteLead);

};
