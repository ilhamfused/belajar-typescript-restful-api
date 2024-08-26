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
    const response = await supertest(app)
      .get(`/api/contacts/${contact.id + 1}`)
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PUT /api/contacts/:contacId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to update contact", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(app).put(`/api/contacts/${contact.id}`).set("X-API-TOKEN", "test").send({
      first_name: "ilham",
      last_name: "rh",
      email: "ilham@ilham.com",
      phone: "06886945",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(contact.id);
    expect(response.body.data.first_name).toBe("ilham");
    expect(response.body.data.last_name).toBe("rh");
    expect(response.body.data.email).toBe("ilham@ilham.com");
    expect(response.body.data.phone).toBe("06886945");
  });

  it("should reject to update contact if request is invalid", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(app).put(`/api/contacts/${contact.id}`).set("X-API-TOKEN", "test").send({
      first_name: "",
      last_name: "",
      email: "ilham",
      phone: "",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("DELETE /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to remove contact", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(app).delete(`/api/contacts/${contact.id}`).set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBe("OK");
  });

  it("should reject to remove contact if contact is not found", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(app)
      .delete(`/api/contacts/${contact.id + 1}`)
      .set("X-API-TOKEN", "test");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to search contact", async () => {
    const response = await supertest(app).get("/api/contacts").set("X-API-TOKEN", "test");

    logger.debug(response);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able to search contact using email", async () => {
    const response = await supertest(app).get("/api/contacts").query({
      email: ".com"
    }).set("X-API-TOKEN", "test");

    logger.debug(response);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able to search contact using name", async () => {
    const response = await supertest(app).get("/api/contacts").query({
      name: "es"
    }).set("X-API-TOKEN", "test");

    logger.debug(response);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able to search contact using phone", async () => {
    const response = await supertest(app).get("/api/contacts").query({
      phone: "7"
    }).set("X-API-TOKEN", "test");

    logger.debug(response);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able to search contact with no result", async () => {
    const response = await supertest(app).get("/api/contacts").query({
      name: "salah"
    }).set("X-API-TOKEN", "test");

    logger.debug(response);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(0);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(0);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able to search contact with paging", async () => {
    const response = await supertest(app).get("/api/contacts").query({
      page: 2,
      size: 1
    }).set("X-API-TOKEN", "test");

    logger.debug(response);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(0);
    expect(response.body.paging.current_page).toBe(2);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(1);
  });
});
