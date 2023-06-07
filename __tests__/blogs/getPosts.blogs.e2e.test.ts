import {client} from "../../src/db";
import request from "supertest";
import {app} from "../../src/app";
import {VALID_BLOG_DATA, VALID_POST_DATA} from "../../src/shared/utils";
import {ViewBlogModel} from "../../src/models/view/ViewBlogModel";
import {HTTPResponseStatusCodes} from "../../src/shared/enums";


describe("GET /blogs/:blogId/posts", () => {

    describe("When data not exist", () => {
        let blogId: string;
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
            blogId = await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send(VALID_BLOG_DATA).expect(HTTPResponseStatusCodes.CREATED).then(el => el.body.id);
        });

        it("should return status code: 200 and empty array", async () => {
            await request(app).get(`/blogs/${blogId}/posts`).expect(HTTPResponseStatusCodes.OK, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            });
        });
    });

    describe("When blog created", () => {
        let blog: ViewBlogModel;
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
            blog = await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send(VALID_BLOG_DATA).expect(HTTPResponseStatusCodes.CREATED).then(el => el.body);
            await request(app).post(`/blogs/${blog.id}/posts`).auth("admin", "qwerty", {type: "basic"}).send({...VALID_POST_DATA, title: "aaaaaaaaa"}).expect(HTTPResponseStatusCodes.CREATED).then(el => el.body)
            await request(app).post(`/blogs/${blog.id}/posts`).auth("admin", "qwerty", {type: "basic"}).send({...VALID_POST_DATA, title: "bbbbbbbbb"}).expect(HTTPResponseStatusCodes.CREATED).then(el => el.body)

        });

        it("should return status code: 200 and expected data", async () => {
            const res = await request(app).get(`/blogs/${blog.id}/posts?pageNumber=2&pageSize=1&page=2`).expect(HTTPResponseStatusCodes.OK).then(el => el.body);
            expect(res).toEqual({
                pagesCount: 2,
                page: 2,
                pageSize: 1,
                totalCount: 2,
                items: [
                    {
                        id: expect.any(String),
                        ...VALID_POST_DATA,
                        title: "aaaaaaaaa",
                        blogId: blog.id,
                        blogName: blog.name,
                        createdAt: expect.any(String)
                    }
                ]
            });
        });

        it("should return status code: 200 and sorted data with direction desc", async () => {
            const res = await request(app).get(`/blogs/${blog.id}/posts?sortBy=title`).expect(HTTPResponseStatusCodes.OK).then(el => el.body);
            expect(res.items[0]).toEqual({
                        id: expect.any(String),
                        ...VALID_POST_DATA,
                        title: "bbbbbbbbb",
                        blogId: blog.id,
                        blogName: blog.name,
                        createdAt: expect.any(String)
            });

            expect(res.items.length).toBe(2);
        });

        it("should return status code: 200 and sorted data with direction asc", async () => {
            const res = await request(app).get(`/blogs/${blog.id}/posts?sortBy=title&sortDirection=asc`).expect(HTTPResponseStatusCodes.OK).then(el => el.body);
            expect(res.items[0]).toEqual({
                id: expect.any(String),
                ...VALID_POST_DATA,
                title: "aaaaaaaaa",
                blogId: blog.id,
                blogName: blog.name,
                createdAt: expect.any(String)
            });

            expect(res.items.length).toBe(2);
        });
    });



    afterAll(async () => {
        await client.close();
    });
});