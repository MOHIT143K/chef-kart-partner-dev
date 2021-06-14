// OTP configuration
import sendOtpMSG91 from "sendotp";

console.log(process.env)

// Pulling out critical properties from process env
const {
  DB_NAME: dbName,
  DB_USER: dbUser,
  DB_PASSWORD: dbPassword,
  DB_HOST: dbHost,
  OTP_AUTH_KEY: OTPAuthKey,
  OTP_SENDER_ID: otpSenerId
} = process.env;

const optService = new sendOtpMSG91(
  OTPAuthKey,
  "Your One time verification Code is {{otp}} "
);

const mongoConnectionString = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}`;

export { dbName, otpSenerId, optService, mongoConnectionString };
