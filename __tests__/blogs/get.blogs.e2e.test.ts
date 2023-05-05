import {app} from "../../src/app";
import request from "supertest";
import {INVALID_VALUE, VALID_BLOG_DATA} from "../../src/shared/utils";


describe("GET /blogs/:blogId", () => {

    describe("When blog not exist", () => {
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
        });

        it ("should return status code: 404", async () => {
            await request(app).get(`/blogs/:blogId`).expect(404);
        });
    });

    describe("When blog exist", () => {
        let blogId: string;
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
            blogId = await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send(VALID_BLOG_DATA).then(el => el.body.id);
        });

        it("should return status code: 200 and expected data", async () => {
            const res = await request(app).get(`/blogs/${blogId}`).expect(200).then(el => el.body);
            expect(res).toEqual({
                ...VALID_BLOG_DATA,
                id: blogId,
            });
        });
    });
});