import fetch from 'node-fetch';

describe("Email confirmation link route", () => {
  it("cannot confirm bad key", async () => {
    const response = await fetch(`${process.env.TEST_HOST}/confirm/1234`);
    const text = await response.text();
    expect(text).toEqual('invalid');
  });
});
