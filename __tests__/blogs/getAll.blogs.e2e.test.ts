import {app} from "../../src/app";
import request from "supertest";
import {VALID_BLOG_DATA} from "../../src/shared/utils";
import {client} from "../../src/db";


describe("GET /blogs", () => {

    describe("When data not exist", () => {
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
        });

        it ("should return status code: 200 and empty array", async () => {
            await request(app).get("/blogs").expect(200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            });
        });
    });

    describe("When data exist", () => {
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
            await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send({...VALID_BLOG_DATA, name: "aaaaaaaaaaaaaaa"});
            await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send({...VALID_BLOG_DATA, name: "bbbbbbbbbbbbbbb"});
        });

        it("should return status code: 200 and expected data", async () => {
            const res = await request(app).get("/blogs").expect(200).then(el => el.body);
            expect(res).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [
                    {
                        ...VALID_BLOG_DATA,
                        name: "bbbbbbbbbbbbbbb",
                        id: expect.any(String),
                        createdAt: expect.any(String),
                        isMembership: false,
                    },
                    {
                        ...VALID_BLOG_DATA,
                        name: "aaaaaaaaaaaaaaa",
                        id: expect.any(String),
                        createdAt: expect.any(String),
                        isMembership: false,
                    }
                ]
            });

            expect(res.items.length).toBe(2);
        });

        it("should return status code: 200 and expected data", async () => {
            const res = await request(app).get("/blogs?pageNumber=2&pageSize=1").expect(200).then(el => el.body);
            expect(res).toEqual({
                pagesCount: 2,
                page: 2,
                pageSize: 1,
                totalCount: 2,
                items: expect.any(Array)
            });
        });

        it("should return status code: 200 and sorted data with direction desc", async () => {
            const res = await request(app).get("/blogs?sortBy=name").expect(200).then(el => el.body);
            expect(res.items[0]).toEqual({
            ...VALID_BLOG_DATA,
                name: "bbbbbbbbbbbbbbb",
                id: expect.any(String),
                createdAt: expect.any(String),
                isMembership: false
            });
        });

        it("should return status code: 200 and sorted data with direction asc", async () => {
            const res = await request(app).get("/blogs?sortBy=name&sortDirection=asc").expect(200).then(el => el.body);
            expect(res.items[0]).toEqual({
            ...VALID_BLOG_DATA,
                name: "aaaaaaaaaaaaaaa",
                id: expect.any(String),
                createdAt: expect.any(String),
                isMembership: false
            });
        });

        it("should return status code: 200 and find blogs", async () => {
            const res = await request(app).get("/blogs?searchNameTerm=aaaaaa").expect(200).then(el => el.body);
            expect(res).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [
                    {
                        ...VALID_BLOG_DATA,
                        name: "aaaaaaaaaaaaaaa",
                        id: expect.any(String),
                        createdAt: expect.any(String),
                        isMembership: false,
                    }
                ]
            });
        });
    });

    afterAll(async () => {
        await client.close();
    });
});