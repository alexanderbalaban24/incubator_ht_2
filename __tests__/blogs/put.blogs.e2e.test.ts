import {app} from "../../src/app";
import request from "supertest";
import {INVALID_VALUE, VALID_BLOG_DATA} from "../../src/shared/utils";


describe("PUT /blogs/:blogId", () => {

    describe("When caller Unauthorized", () => {
        let blogId: string;
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
            blogId = await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send(VALID_BLOG_DATA).then(el => el.body.id);
        });

        it("should return status code: 401", async () => {
            await request(app).put(`/blogs/${blogId}`).expect(401);
        });
    });

    describe("When invalid value in body", () => {
        let blogId: string;
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
            blogId = await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send(VALID_BLOG_DATA).then(el => el.body.id);
        });

        it("should return status code: 400", async () => {
            const checks: any = [];
            Object.keys(VALID_BLOG_DATA).forEach(field => {
                const check = request(app).put(`/blogs/${blogId}`).auth("admin", "qwerty", {type: "basic"}).send({
                    ...VALID_BLOG_DATA,
                    [field]: INVALID_VALUE
                }).expect(400);

                checks.push(check);
            });

            await Promise.all(checks);
        });
    });

    describe("When blog updated", () => {
        let blogId: string;
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
            blogId = await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send(VALID_BLOG_DATA).then(el => el.body.id);
        });

        it("should return status code: 204", async () => {
            const blog = await request(app).put(`/blogs/${blogId}`).auth("admin", "qwerty", {type: "basic"}).send({...VALID_BLOG_DATA, name: "updated"}).expect(204);
        })

        it("should return status code: 200 and expected data with use get endpoint", async () => {
            const blog = await request(app).get(`/blogs/${blogId}`).expect(200).then(el => el.body);
            expect(blog).toEqual({
                ...VALID_BLOG_DATA,
                name: "updated",
                id: expect.any(String),
            });
        });
    });
});