import { getPeriodTimeStamp, isValidMobileNo } from "../../../helpers/utils";

describe("Mobile No Helpers", () => {
  test("Invalid Mobile - More than 10 digits", () => {
    expect(isValidMobileNo("38463784637864783")).toEqual(false);
  });
  test("Invalid Mobile - Less than 10 digits", () => {
    expect(isValidMobileNo("46735463")).toEqual(false);
  });
  test("Invalid Mobile - Character other than digits", () => {
    expect(isValidMobileNo("464a#5463")).toEqual(false);
  });
  test("Correct Mobile No - 10 Digits", () => {
    expect(isValidMobileNo("9838382107")).toEqual(true);
  });
});

describe("Get Specific Period Helper", () => {
  test("Today's Time Stamp", () => {
    const currentDate = new Date();
    const timeStampToExpect = Math.floor(
      currentDate.setDate(currentDate.getDate() - 1) / 1000
    );
    expect(Math.floor(getPeriodTimeStamp("today") / 1000)).toEqual(
      timeStampToExpect
    );
  });
  test("Weeks's Time Stamp", () => {
    const currentDate = new Date();
    const timeStampToExpect = Math.floor(
      currentDate.setDate(currentDate.getDate() - 7) / 1000
    );
    expect(Math.floor(getPeriodTimeStamp("week") / 1000)).toEqual(
      timeStampToExpect
    );
  });
  test("Fortnight's Time Stamp", () => {
    const currentDate = new Date();
    const timeStampToExpect = Math.floor(
      currentDate.setDate(currentDate.getDate() - 14) / 1000
    );
    expect(Math.floor(getPeriodTimeStamp("fortnight") / 1000)).toEqual(
      timeStampToExpect
    );
  });
  test("Monthly Time Stamp", () => {
    const currentDate = new Date();
    const timeStampToExpect = Math.floor(
      currentDate.setDate(currentDate.getDate() - 30) / 1000
    );
    expect(Math.floor(getPeriodTimeStamp("month") / 1000)).toEqual(
      timeStampToExpect
    );
  });
  test("3 Months's Time Stamp", () => {
    const currentDate = new Date();
    const timeStampToExpect = Math.floor(
      currentDate.setDate(currentDate.getDate() - 90) / 1000
    );
    expect(Math.floor(getPeriodTimeStamp("3_months") / 1000)).toEqual(
      timeStampToExpect
    );
  });
});
