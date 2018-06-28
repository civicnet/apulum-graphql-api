import fetch from 'node-fetch';

describe("Email confirmation link route", () => {
  it("cannot confirm bad key", async () => {
    const url = `${process.env.TEST_HOST}/confirm/1234`;
    const response = await fetch(url);
    expect(response.url === url).toBeFalsy();
  });
});
