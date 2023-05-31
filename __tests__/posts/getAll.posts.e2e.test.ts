import request from "supertest";
import {app} from "../../src/app";
import {VALID_BLOG_DATA, VALID_POST_DATA} from "../../src/shared/utils";
import {ViewBlogModel} from "../../src/models/blog/ViewBlogModel";
import {client} from "../../src/db";
import {HTTPResponseStatusCodes} from "../../src/shared/enums";


describe("GET /posts", () => {

    describe("When data not exist", () => {
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
        });

        it("should return status code: 200 and empty array", async () => {
            await request(app).get("/posts").expect(HTTPResponseStatusCodes.OK, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            });
        });
    });

    describe("When data exist", () => {
        let blog: ViewBlogModel;
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
            blog = await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send(VALID_BLOG_DATA).expect(HTTPResponseStatusCodes.CREATED).then(el => el.body);
            await request(app).post(`/posts`).auth("admin", "qwerty", {type: "basic"}).send({
                ...VALID_POST_DATA,
                title: "aaaaaaaaaaaa",
                blogId: blog.id
            }).expect(HTTPResponseStatusCodes.CREATED).then(el => el.body)
            await request(app).post(`/posts`).auth("admin", "qwerty", {type: "basic"}).send({
                ...VALID_POST_DATA,
                title: "bbbbbbbbbbbb",
                blogId: blog.id
            }).expect(HTTPResponseStatusCodes.CREATED).then(el => el.body)
        });

        it("should return status code: 200 and expected data", async () => {
            const res = await request(app).get("/posts?pageNumber=2&pageSize=1&page=2").expect(HTTPResponseStatusCodes.OK).then(el => el.body);
            expect(res).toEqual({
                pagesCount: 2,
                page: 2,
                pageSize: 1,
                totalCount: 2,
                items: [
                    {
                        id: expect.any(String),
                        ...VALID_POST_DATA,
                        title: "aaaaaaaaaaaa",
                        blogId: blog.id,
                        blogName: blog.name,
                        createdAt: expect.any(String)
                    }
                ]
            });
        });

        it("should return status code: 200 and sorted data with direction desc", async () => {
            const res = await request(app).get("/posts?sortBy=title").expect(HTTPResponseStatusCodes.OK).then(el => el.body);
            expect(res.items[0]).toEqual({
                id: expect.any(String),
                ...VALID_POST_DATA,
                title: "bbbbbbbbbbbb",
                blogId: blog.id,
                blogName: blog.name,
                createdAt: expect.any(String)
            });
        });

        it("should return status code: 200 and sorted data with direction asc", async () => {
            const res = await request(app).get("/posts?sortBy=title&sortDirection=asc").expect(HTTPResponseStatusCodes.OK).then(el => el.body);
            expect(res.items[0]).toEqual({
                id: expect.any(String),
                ...VALID_POST_DATA,
                title: "aaaaaaaaaaaa",
                blogId: blog.id,
                blogName: blog.name,
                createdAt: expect.any(String)
            });
        });
    });

    afterAll(async () => {
        await client.close();
    });
});