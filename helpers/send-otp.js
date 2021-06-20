import { optService, otpSenerId } from "../config/config.js";
import { isValidMobileNo } from "../helpers/utils.js";

export const sendOTPHelper = (mobileNo, otpCallBack) => {
  if (!mobileNo || !isValidMobileNo(mobileNo)) {
    return false;
  }
  optService.send(mobileNo, otpSenerId, otpCallBack);
  return true;
};
