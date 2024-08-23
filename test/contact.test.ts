import supertest from "supertest";
import { ContactTest, UserTest } from "./test-util";
import { app } from "../src/application/app";
import { logger } from "../src/application/logging";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to create new contact", async () => {
    const response = await supertest(app).post("/api/contacts").set("X-API-TOKEN", "test").send({
      first_name: "ilham",
      last_name: "rh",
      email: "ilham@ilham.com",
      phone: "06886945",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.first_name).toBe("ilham");
    expect(response.body.data.last_name).toBe("rh");
    expect(response.body.data.email).toBe("ilham@ilham.com");
    expect(response.body.data.phone).toBe("06886945");
  });

  it("should reject to create new contact if data is invalid", async () => {
    const response = await supertest(app).post("/api/contacts").set("X-API-TOKEN", "test").send({
      first_name: "",
      last_name: "",
      email: "ilham",
      phone: "06886945068869450688694506886945",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able get contact", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(app).get(`/api/contacts/${contact.id}`).set("X-API-TOKEN", "test");
    
    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.first_name).toBe(contact.first_name);
    expect(response.body.data.last_name).toBe(contact.last_name);
    expect(response.body.data.email).toBe(contact.email);
    expect(response.body.data.phone).toBe(contact.phone);
  });

  it("should reject to get contact if contact is not found", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(app).get(`/api/contacts/${contact.id + 1}`).set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});
