import supertest from "supertest";
import { AddressTest, ContactTest, UserTest } from "./test-util";
import { app } from "../src/application/app";
import { logger } from "../src/application/logging";

describe("POST /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to create address", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(app).post(`/api/contacts/${contact.id}/addresses`).set("X-API-TOKEN", "test").send({
      street: "Jalan sama kamu",
      city: "Semarang",
      province: "Jawa Tengah",
      country: "Indonesia",
      postal_code: "11111",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.street).toBe("Jalan sama kamu");
    expect(response.body.data.city).toBe("Semarang");
    expect(response.body.data.province).toBe("Jawa Tengah");
    expect(response.body.data.country).toBe("Indonesia");
    expect(response.body.data.postal_code).toBe("11111");
  });

  it("should reject to create address if request is invalid", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(app).post(`/api/contacts/${contact.id}/addresses`).set("X-API-TOKEN", "test").send({
      street: "Jalan sama kamu",
      city: "Semarang",
      province: "Jawa Tengah",
      country: "",
      postal_code: "",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should reject to create address if contact is not found", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(app)
      .post(`/api/contacts/${contact.id + 1}/addresses`)
      .set("X-API-TOKEN", "test")
      .send({
        street: "Jalan sama kamu",
        city: "Semarang",
        province: "Jawa Tengah",
        country: "Indonesia",
        postal_code: "11111",
      });

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});
