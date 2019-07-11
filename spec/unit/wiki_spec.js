const sequelize = require("../../src/db/models/index").sequelize;
const request = require("request");
const base = "http://localhost:3000/wikis/";
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {
	beforeEach(done => {
		this.wiki;
		this.user;

		sequelize.sync({ force: true }).then(res => {
			User.create({
				username: "kerry123",
				email: "wonderwoman@wonder.com",
				password: "Trekkie4lyfe"
			}).then(user => {
				this.user = user;
				request.get({
					url: "http://localhost:3000/auth/fake",
					form: {
						id: user.id,
						username: user.name,
						email: user.email
					}
				});

				Wiki.create(
					{
						title: "All About Polar Bears",
						body: "Everything you need to know about polar bears",
						userId: user.id,
						private: false
					}
				).then(wiki => {
					this.wiki = wiki;
					done();
				});
			});
		});
	});

	describe("POST, /wikis/create", () => {
		it("should create a wiki with a title, body, and list whether it is private or not and redirect", done => {
			Wiki.create({
				title: "Another day in Boston",
				body: "Boston is a nice city",
				private: false,
				userId: this.user.id
			})
				.then(wiki => {
					expect(wiki.title).toBe("Another day in Boston");
					expect(wiki.body).toBe(
						"Boston is a nice city"
					);
					expect(wiki.private).toBe(false);
					expect(wiki.userId).toBe(this.user.id);
					done();
				})
				.catch(err => {
					console.log(err);
					done();
				});
		});
		it("should not create a wiki with missing title, body, or privacy description", done => {
			Wiki.create({
				title: "Pros of having pets"
			})
				.then(wiki => {
					done();
				})
				.catch(err => {
					expect(err.message).toContain("Wiki.body cannot be null");
					expect(err.message).toContain("Wiki.private cannot be null");
					done();
				});
		});
	});

	describe("GET /wikis", () => {
		it("should render the wiki index page", done => {
			request.get(base, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain("Wikis");
				done();
			});
		});
	});
});