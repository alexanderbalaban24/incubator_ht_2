import {app} from "../../src/app";
import request from "supertest";
import {INVALID_VALUE, VALID_BLOG_DATA} from "../../src/shared/utils";


describe("POST /blogs", () => {

    describe("When caller Unauthorized", () => {
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
        });

        it("should return status code: 401", async () => {
            await request(app).post("/blogs").expect(401);
        });
    });

    describe("When invalid value in body", () => {
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
        });

        it("should return status code: 400", async () => {
            const checks: any = [];
            Object.keys(VALID_BLOG_DATA).forEach(field => {
                const check = request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send({
                    ...VALID_BLOG_DATA,
                    [field]: INVALID_VALUE
                }).expect(400);

                checks.push(check);
            });

            await Promise.all(checks);
        });
    });

    describe("When blog created", () => {
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
        });

        it("should return status code: 201  and expected data", async () => {
            const blog = await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send(VALID_BLOG_DATA).expect(201).then(el => el.body);
            expect(blog).toEqual({
                ...VALID_BLOG_DATA,
                id: expect.any(String),
            });
        })

        it("should return status code: 200 and expected data with use get endpoint", async () => {
            const res = await request(app).get("/blogs").expect(200).then(el => el.body);
            expect(res[0]).toEqual({
                ...VALID_BLOG_DATA,
                id: expect.any(String),
            });

            expect(res.length).toBe(1);
        });
    });
});