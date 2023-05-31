import {app} from "../../src/app";
import request from "supertest";
import {VALID_BLOG_DATA} from "../../src/shared/utils";
import {client} from "../../src/db";
import {HTTPResponseStatusCodes} from "../../src/shared/enums";


describe("GET /blogs/:blogId", () => {

    describe("When blog not exist", () => {
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
        });

        it ("should return status code: 404", async () => {
            await request(app).get(`/blogs/64613aba832813de2992088f`).expect(HTTPResponseStatusCodes.NOT_FOUND);
        });
    });

    describe("When blog exist", () => {
        let blogId: string;
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
            blogId = await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send(VALID_BLOG_DATA).then(el => el.body.id);
        });

        it("should return status code: 200 and expected data", async () => {
            const res = await request(app).get(`/blogs/${blogId}`).expect(HTTPResponseStatusCodes.OK).then(el => el.body);
            expect(res).toEqual({
                ...VALID_BLOG_DATA,
                createdAt: expect.any(String),
                isMembership: false,
                id: blogId,
            });
        });
    });

    afterAll(async () => {
        await client.close();
    });
});
