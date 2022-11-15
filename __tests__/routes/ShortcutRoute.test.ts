import request from "supertest";
import app from "../../src/app";
import connection from "../../src/database";
import { Shortcut } from "../../src/models/Shortcut";
import { User } from "../../src/models/User";
import { UserToken } from "../../src/models/UserToken";
import { AuthService } from "../../src/services/AuthService";
import { LoginInterface } from "../../src/types/AuthType";
import { JwtEncode } from "../../src/utils/JwtUtils";
import { GetLoginUser } from "../../src/utils/TestUtils";

describe("ShortcutRoutes list", () => {
  test("shortcut get without token", async () => {
    const res = await request(app).get("/shortcut");
    expect(res.body.status).toBe(401);
    expect(res.body.message).toBe("Please login.");
  });
  test("shortcut get valid", async () => {
    await connection.sync();
    const { token } = await GetLoginUser();

    const res = await request(app).get("/shortcut").set("Authorization", token);

    expect(res.body.status).toBe(200);
    expect(res.body.message).toBe("Successfully get the data.");
  });
});

describe("ShortcutRoutes create", () => {
  test("shortcut get without token", async () => {
    const res = await request(app).post("/shortcut");
    expect(res.body.status).toBe(401);
    expect(res.body.message).toBe("Please login.");
  });
  test("shortcut no params", async () => {
    await connection.sync();
    const { token } = await GetLoginUser();

    const res = await request(app)
      .post("/shortcut")
      .set("Authorization", token);

    expect(res.body.status).toBe(400);
    expect(res.body.message).toBe("shortlink is required.");
  });
  test("shortcut valid shortlink", async () => {
    await connection.sync();
    const { token } = await GetLoginUser();

    const res = await request(app)
      .post("/shortcut")
      .set("Authorization", token)
      .query({ shortlink: "portfolio" });

    expect(res.body.status).toBe(400);
    expect(res.body.message).toBe("url is required.");
  });
  test("shortcut valid shortlink url", async () => {
    await connection.sync();
    const { token } = await GetLoginUser();

    const res = await request(app)
      .post("/shortcut")
      .set("Authorization", token)
      .query({ shortlink: "portfolio", url: "http://me.nfraz.co.in" });

    expect(res.body.status).toBe(400);
    expect(res.body.message).toBe("description is required.");
  });
  test("shortcut valid data", async () => {
    await connection.sync();
    await Shortcut.destroy({ truncate: true });
    const { token } = await GetLoginUser();

    const res = await request(app)
      .post("/shortcut")
      .set("Authorization", token)
      .query({
        shortlink: "portfolio",
        url: "http://me.nfraz.co.in",
        description: "portfolio website",
      });

    expect(res.body.status).toBe(200);
    expect(res.body.message).toBe("Successfully created.");
  });
});

describe("ShortcutRoutes update", () => {
  test("shortcut valid data", async () => {
    await connection.sync();
    await Shortcut.destroy({ truncate: true });
    const { token } = await GetLoginUser();

    const res = await request(app)
      .post("/shortcut")
      .set("Authorization", token)
      .query({
        shortlink: "portfolio",
        url: "http://me.nfraz.co.in",
        description: "portfolio website",
      });

    expect(res.body.status).toBe(200);
    expect(res.body.message).toBe("Successfully created.");

    const res1 = await request(app)
      .put("/shortcut/1")
      .set("Authorization", token)
      .query({
        shortlink: "portfolio-updated",
        url: "http://me.nfraz.co.in",
        description: "portfolio website updated",
      });

    expect(res1.body.status).toBe(200);
    expect(res1.body.message).toBe("Successfully updated.");
  });
});

describe("ShortcutRoutes delete", () => {
  test("shortcut not found data", async () => {
    await connection.sync();
    await Shortcut.destroy({ truncate: true });
    const { token } = await GetLoginUser();

    const res = await request(app)
      .delete("/shortcut/1")
      .set("Authorization", token);

    expect(res.body.status).toBe(404);
    expect(res.body.message).toBe("data not found.");
  });
  test("shortcut valid data", async () => {
    await connection.sync();
    await Shortcut.destroy({ truncate: true });
    const { token } = await GetLoginUser();

    const res = await request(app)
      .post("/shortcut")
      .set("Authorization", token)
      .query({
        shortlink: "portfolio",
        url: "http://me.nfraz.co.in",
        description: "portfolio website",
      });

    expect(res.body.status).toBe(200);
    expect(res.body.message).toBe("Successfully created.");

    const res1 = await request(app)
      .delete("/shortcut/1")
      .set("Authorization", token);

    expect(res1.body.status).toBe(200);
    expect(res1.body.message).toBe("Successfully deleted.");
  });
});
