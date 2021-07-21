import { sendOTPHelper } from "../../../helpers/send-otp";

describe("Send OTP Helper", () => {
  test("OTP Failure For Invalid Mobile", () => {
    expect(sendOTPHelper("hfjkdhfjd", () => {})).toEqual(false);
  });
  //This is commented out to prevent real otp
  // test("OTP Success with Valid Mobile", () => {
  //   expect(sendOTPHelper("8700143571", () => {})).toEqual(true);
  // });
});
