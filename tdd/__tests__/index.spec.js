import request from "supertest";
import app from "../index";

describe("Todos", () => {
  it("should get all todos", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.body.todos).toBeInstanceOf(Array);
  });

  it("should get single job by id", async () => {
    const res = await request(app).get("/todos/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.todo).toEqual(
      expect.objectContaining({
        userId: expect.any(Number),
        id: expect.any(Number),
        title: expect.any(String),
        completed: expect.any(Boolean),
      })
    );
  });

  it("should throw todo not found error", async () => {
    const res = await request(app).get("/todos/84398483");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Todo not found");
  });
});
