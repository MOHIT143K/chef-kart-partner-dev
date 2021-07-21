import { decodeJWT, createJWT } from "../../../helpers/create-decode-jwt";

describe("Helpers JWT", () => {
  const dataString = "_hfjdgfjdgfjdgfjdg";
  const encodedData = createJWT(dataString);
  test("Econding JWT", () => {
    expect(typeof encodedData).toEqual("string");
  });
  test("Decoding JWT", () => {
    expect(decodeJWT(encodedData)).toBe(dataString);
  });
});
