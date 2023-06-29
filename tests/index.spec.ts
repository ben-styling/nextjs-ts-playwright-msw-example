import { expect } from "@playwright/test";
import test from "./next-fixture";

test("book title1", async ({ page, goto, mockBook }) => {
  // mock the response of the server-side request
  await mockBook({
    title: "Lord of the Rings",
    imageUrl: "/lord-of-the-rings.jpg",
    description:
      "The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.",
  });

  await goto("/testing");
  const name = await page.innerText("h1");
  expect(name).toBe("Lord of the Rings");
  await mockBook({
    title: "Lord of the Rings2",
    imageUrl: "/lord-of-the-rings.jpg",
    description:
      "The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.",
  });
  await goto("/testing");
  const name2 = await page.innerText("h1");
  expect(name2).toBe("Lord of the Rings2");
});

test("book title2", async ({ page, goto, mockBook }) => {
  // mock the response of the server-side request
  await mockBook({
    title: "Lord of the Rings",
    imageUrl: "/lord-of-the-rings.jpg",
    description:
      "The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.",
  });

  await goto("/testing");
  const name = await page.innerText("h1");
  expect(name).toBe("Lord of the Rings");
  await mockBook({
    title: "Lord of the Rings2",
    imageUrl: "/lord-of-the-rings.jpg",
    description:
      "The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.",
  });
  await goto("/testing");
  const name2 = await page.innerText("h1");
  expect(name2).toBe("Lord of the Rings2");
});

test("book title3", async ({ page, goto, mockBook }) => {
  // mock the response of the server-side request
  await mockBook({
    title: "Lord of the Rings",
    imageUrl: "/lord-of-the-rings.jpg",
    description:
      "The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.",
  });

  await goto("/testing");
  const name = await page.innerText("h1");
  expect(name).toBe("Lord of the Rings");
  await mockBook({
    title: "Lord of the Rings2",
    imageUrl: "/lord-of-the-rings.jpg",
    description:
      "The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.",
  });
  await goto("/testing");
  const name2 = await page.innerText("h1");
  expect(name2).toBe("Lord of the Rings2");
});

test("reviews", async ({ page, app: { port }, mockBook }) => {
  // mock the response of the server-side request
  await mockBook({
    title: "Lord of the Rings",
    imageUrl: "/lord-of-the-rings.jpg",
    description:
      "The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.",
  });

  // mock the response to the client-side request
  await page.route(`http://localhost:${port}/testing/api/reviews`, (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        {
          id: "60333292-7ca1-4361-bf38-b6b43b90cb16",
          author: "John Maverick",
          text: "Lord of The Rings, is with no absolute hesitation, my most favored and adored book by‑far. The triology is wonderful‑ and I really consider this a legendary fantasy series. It will always keep you at the edge of your seat‑ and the characters you will grow and fall in love with!",
        },
      ]),
    })
  );

  await page.goto(`http://localhost:${port}/testing/`);
  await page.click("button");

  const description = await page.innerText("ul li p");
  expect(description).toMatch(
    /^Lord of The Rings, is with no absolute hesitation/
  );
});
