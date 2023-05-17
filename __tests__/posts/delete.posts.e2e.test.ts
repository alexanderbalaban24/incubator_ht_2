import request from "supertest";
import {app} from "../../src/app";
import {VALID_BLOG_DATA, VALID_POST_DATA} from "../../src/shared/utils";
import {ViewBlogModel} from "../../src/models/blog/ViewBlogModel";
import {client} from "../../src/db";


describe("DELETE /posts", () => {

    describe("When deleted blog", () => {
        let postId: string;
        let blog: ViewBlogModel;
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
            blog = await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send(VALID_BLOG_DATA).then(el => el.body);
            postId = await request(app).post("/posts").auth("admin", "qwerty", {type: "basic"}).send({...VALID_POST_DATA, blogId: blog.id}).then(el => el.body.id);
        });

        it("should return status code: 200 and expected data", async () => {
            const res = await request(app).get(`/posts/${postId}`).expect(200).then(el => el.body);
            expect(res).toEqual({
                id: expect.any(String),
                ...VALID_POST_DATA,
                blogId: blog.id,
                blogName: blog.name,
                createdAt: expect.any(String)
            });
        });

        it("should return status code: 204", async () => {
            await request(app).delete(`/posts/${postId}`).auth("admin", "qwerty", {type: "basic"}).expect(204);
        });

        it("should return status code: 200", async () => {
            await request(app).get("/posts").expect(200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
        })
    });

    afterAll(async () => {
        await client.close();
    });
});