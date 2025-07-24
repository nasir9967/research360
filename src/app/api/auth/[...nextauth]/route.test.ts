import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";

jest.mock("next-auth/providers/google");
jest.mock("next-auth");

describe("NextAuth GoogleProvider", () => {
  it("should use env variables for clientId and clientSecret", () => {
    process.env.GOOGLE_CLIENT_ID = "test-client-id";
    process.env.GOOGLE_CLIENT_SECRET = "test-client-secret";

    require("./route"); // This will run your handler

    expect(GoogleProvider).toHaveBeenCalledWith({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });
  });
});
