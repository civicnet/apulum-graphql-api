import { createConfirmEmailLink } from "../createConfirmEmailLink";
import { createTypeormConn } from "../createTypeormConn";
import { User } from "../../entity/User";
import { Connection } from "typeorm";


import * as Redis from 'ioredis';
import fetch from 'node-fetch';

let userId = '';
const redis = new Redis();

let conn: Connection;

beforeAll(async() => {
  conn = await createTypeormConn();
  const user = await User.create({
    email: "confirmation@test.com",
    password: "1234",
  }).save();
  userId = user.id;
})

afterAll(async () => {
  conn.close();
});

describe("New account confirmation link", () => {
  it("can confirm account from link, and remove key", async () => {
    const url = await createConfirmEmailLink(
      process.env.TEST_HOST as string,
      userId,
      redis,
    );

    const response = await fetch(url);
    const text = await response.text();
    expect(text).toEqual('ok');

    const user = await User.findOne({ where: { id: userId }});
    expect((user as User).confirmed).toBeTruthy();

    const chunks = url.split('/');
    const key = chunks[chunks.length - 1];

    const redis_key = await redis.get(key);
    expect(redis_key).toBeNull();
  });

  it("cannot confirm bad key", async () => {
    const response = await fetch(`${process.env.TEST_HOST}/confirm/1234`);
    const text = await response.text();
    expect(text).toEqual('invalid');
  });
});
