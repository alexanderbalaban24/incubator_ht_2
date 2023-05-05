import {app} from "../../src/app";
import request from "supertest";
import {VALID_BLOG_DATA} from "../../src/shared/utils";


describe("DELETE /blogs", () => {

    describe("When deleted blog", () => {
        let blogId: string;
        beforeAll(async () => {
            await request(app).delete("/testing/all-data");
            blogId = await request(app).post("/blogs").auth("admin", "qwerty", {type: "basic"}).send(VALID_BLOG_DATA).then(el => el.body.id);
        });

        it("should return status code: 200 and expected data before deleted", async () => {
            const res = await request(app).get(`/blogs/${blogId}`).expect(200).then(el => el.body);
            expect(res).toEqual({
                ...VALID_BLOG_DATA,
                id: expect.any(String),
            });
        });

        it("should return status code: 204", async () => {
            await request(app).delete(`/blogs/${blogId}`).auth("admin", "qwerty", {type: "basic"}).expect(204);
        });

        it("should return status code: 200 and empty array", async () => {
            const res = await request(app).get("/blogs").expect(200, []);
        });
    });
});