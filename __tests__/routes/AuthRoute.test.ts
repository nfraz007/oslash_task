import request from "supertest";
import app from "../../src/app";
import connection from "../../src/database";
import { User } from "../../src/models/User";
import { GetLoginUser } from "../../src/utils/TestUtils";

describe("AuthRoutes /register", () => {
  test("register without params", async () => {
    const res = await request(app).post("/auth/register");
    expect(res.body.status).toBe(400);
    expect(res.body.message).toBe("email is required.");
  });
  test("register only invalid email", async () => {
    const res = await request(app)
      .post("/auth/register")
      .query({ email: "abc" });
    expect(res.body.status).toBe(400);
    expect(res.body.message).toBe("email is invalid.");
  });
  test("register valid email but no password", async () => {
    const res = await request(app)
      .post("/auth/register")
      .query({ email: "test@gmail.com" });
    expect(res.body.status).toBe(400);
    expect(res.body.message).toBe("password is required.");
  });
  test("register valid email password, no name", async () => {
    const res = await request(app)
      .post("/auth/register")
      .query({ email: "test@gmail.com", password: "abc" });
    expect(res.body.status).toBe(400);
    expect(res.body.message).toBe("name is required.");
  });
  test("register valid email password name", async () => {
    await connection.sync();
    await User.destroy({ truncate: true });

    const res = await request(app).post("/auth/register").query({
      email: "test@gmail.com",
      password: "123456",
      name: "Test User",
    });
    expect(res.body.status).toBe(200);
    expect(res.body.message).toBe("Successfully registered.");
  });
  test("register already exist email", async () => {
    await connection.sync();
    await User.destroy({ truncate: true });

    const res = await request(app).post("/auth/register").query({
      email: "test@gmail.com",
      password: "123456",
      name: "Test User",
    });
    expect(res.body.status).toBe(200);
    expect(res.body.message).toBe("Successfully registered.");

    const res1 = await request(app).post("/auth/register").query({
      email: "test@gmail.com",
      password: "123456",
      name: "Test User",
    });
    expect(res1.body.status).toBe(400);
    expect(res1.body.message).toBe("sorry, email already exist.");
  });
});

describe("AuthRoutes /login", () => {
  test("login without params", async () => {
    const res = await request(app).post("/auth/login");
    expect(res.body.status).toBe(400);
    expect(res.body.message).toBe("email is required.");
  });
  test("login invalid email", async () => {
    const res = await request(app).post("/auth/login").query({ email: "abc" });
    expect(res.body.status).toBe(400);
    expect(res.body.message).toBe("email is invalid.");
  });
  test("login valid email, no password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .query({ email: "test@gmail.com" });
    expect(res.body.status).toBe(400);
    expect(res.body.message).toBe("password is required.");
  });
  test("login valid email, invalid password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .query({ email: "test@gmail.com", password: "12345" });
    expect(res.body.status).toBe(400);
    expect(res.body.message).toBe("sorry, email or password is invalid.");
  });
  test("login valid email password", async () => {
    await connection.sync();
    await User.destroy({ truncate: true });

    const res = await request(app).post("/auth/register").query({
      email: "test@gmail.com",
      password: "123456",
      name: "Test User",
    });
    expect(res.body.status).toBe(200);
    expect(res.body.message).toBe("Successfully registered.");

    const res1 = await request(app)
      .post("/auth/login")
      .query({ email: "test@gmail.com", password: "123456" });
    expect(res1.body.status).toBe(200);
    expect(res1.body.message).toBe("Successfully Login.");
  });
});

describe("AuthRoutes /logout", () => {
  test("logout without token", async () => {
    const res = await request(app).post("/auth/logout");
    expect(res.body.status).toBe(401);
    expect(res.body.message).toBe("Please login.");
  });
  test("logout with token", async () => {
    await connection.sync();
    const { token } = await GetLoginUser();

    const res = await request(app)
      .post("/auth/logout")
      .set("Authorization", token);

    expect(res.body.status).toBe(200);
    expect(res.body.message).toBe("Successfully logout.");
  });
});
