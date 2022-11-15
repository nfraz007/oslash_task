import request from "supertest";
import app from "../src/app";

describe("app.ts test", () => {
  test("home route", async () => {
    const res = await request(app).get("/");
    expect(res.body).toEqual({ message: "Api is working" });
  });
});
