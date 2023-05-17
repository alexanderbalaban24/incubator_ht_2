import request from "supertest";
import {app} from "../../src/app";
import {INVALID_VALUE, VALID_BLOG_DATA, VALID_POST_DATA} from "../../src/shared/utils";
import {ViewBlogModel} from "../../src/models/blog/ViewBlogModel";


describe("POST /posts", () => {

    describe("When caller Unauthorized", () => {

        let blogId: string;
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
            blogId = await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send(VALID_BLOG_DATA).expect(201).then(el => el.body.id);
        });

        it("should return status code: 401", async () => {
            await request(app).post("/posts").send(VALID_POST_DATA).expect(401);
        });
    });

    describe("When invalid value in body", () => {
        let blog: ViewBlogModel;
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
            blog = await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send(VALID_BLOG_DATA).expect(201).then(el => el.body);
        });

        it("should return status code: 400", async () => {
            const checks: any = [];
            Object.keys(VALID_POST_DATA).forEach(field => {
                const check = request(app).post(`/posts`).auth("admin", "qwerty", {type: "basic"}).send({
                    ...VALID_BLOG_DATA,
                    blogId: blog.id,
                    [field]: INVALID_VALUE
                }).expect(400);

                checks.push(check);
            });

            await Promise.all(checks);
        });
    });

    describe("When post created", () => {
        let blog: ViewBlogModel;
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
            blog = await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send(VALID_BLOG_DATA).expect(201).then(el => el.body);
        });

        it("should return status code: 201 and expected data", async () => {
            const res = await request(app).post("/posts").auth("admin", "qwerty", {type: "basic"}).send({...VALID_POST_DATA, blogId: blog.id}).then(el => el.body);
            expect(res).toEqual({
                id: expect.any(String),
                ...VALID_POST_DATA,
                blogId: blog.id,
                blogName: blog.name,
                createdAt: expect.any(String)
            });
        });

        it("should return status code: 200 and expected data", async () => {
            const res = await request(app).get("/posts").expect(200).then(el => el.body);
            expect(res.items[0]).toEqual({
                id: expect.any(String),
                ...VALID_POST_DATA,
                blogId: blog.id,
                blogName: blog.name,
                createdAt: expect.any(String)
            });

            expect(res.items.length).toBe(1);
        })
    });
});