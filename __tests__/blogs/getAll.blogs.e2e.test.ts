import {app} from "../../src/app";
import request from "supertest";
import {VALID_BLOG_DATA} from "../../src/shared/utils";


describe("GET /blogs", () => {

    describe("When data not exist", () => {
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
        });

        it ("should return status code: 200 and empty array", async () => {
            await request(app).get("/blogs").expect(200, []);
        });
    });

    describe("When data exist", () => {
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
            await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send(VALID_BLOG_DATA);
            await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send(VALID_BLOG_DATA);
        });

        it("should return status code: 200 and expected data", async () => {
            const res = await request(app).get("/blogs").expect(200).then(el => el.body);
            expect(res[0]).toEqual({
                ...VALID_BLOG_DATA,
                id: expect.any(String),
            });

            expect(res.length).toBe(2);
        });
    });
});