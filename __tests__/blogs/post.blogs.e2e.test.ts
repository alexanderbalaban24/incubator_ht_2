import {app} from "../../src/app";
import request from "supertest";
import {INVALID_VALUE, VALID_BLOG_DATA} from "../../src/shared/utils";
import {client} from "../../src/db/run-db";
import {HTTPResponseStatusCodes} from "../../src/shared/enums";


describe("POST /blogs", () => {

    describe("When caller Unauthorized", () => {
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
        });

        it("should return status code: 401", async () => {
            await request(app).post("/blogs").expect(HTTPResponseStatusCodes.UNAUTHORIZED);
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
                }).expect(HTTPResponseStatusCodes.BAD_REQUEST);

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
            const blog = await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send(VALID_BLOG_DATA).expect(HTTPResponseStatusCodes.CREATED).then(el => el.body);
            expect(blog).toEqual({
                ...VALID_BLOG_DATA,
                createdAt: expect.any(String),
                isMembership: false,
                id: expect.any(String),
            });
        })

        it("should return status code: 200 and expected data with use get endpoint", async () => {
            const res = await request(app).get("/blogs").expect(HTTPResponseStatusCodes.OK).then(el => el.body);
            expect(res.items[0]).toEqual({
                ...VALID_BLOG_DATA,
                createdAt: expect.any(String),
                isMembership: false,
                id: expect.any(String),
            });

            expect(res.items.length).toBe(1);
        });
    });

    afterAll(async () => {
        await client.close();
    });
});
