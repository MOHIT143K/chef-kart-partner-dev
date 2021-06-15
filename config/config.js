// OTP configuration
import sendOtpMSG91 from "sendotp";

// Pulling out critical properties from process env
const {
  DB_NAME: dbName,
  DB_USER: dbUser,
  DB_PASSWORD: dbPassword,
  DB_HOST: dbHost,
  OTP_AUTH_KEY: OTPAuthKey,
  OTP_SENDER_ID: otpSenerId,
  JWT_SECRET_KEY: jwtSecretKey,
} = process.env || {};

const optService = new sendOtpMSG91(
  OTPAuthKey,
  "Your One time verification Code is {{otp}} "
);

const mongoConnectionString = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}`;

export { dbName, otpSenerId, optService, mongoConnectionString, jwtSecretKey };
