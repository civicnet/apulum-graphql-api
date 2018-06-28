import { createConfirmEmailLink } from "../createConfirmEmailLink";
import { createTypeormConn } from '../../../utils/createTypeormConn';
import { User } from '../../../entity/User';
import { Connection } from "typeorm";
import * as casual from 'casual';


import * as Redis from 'ioredis';
import fetch from 'node-fetch';

let userId = '';
const redis = new Redis();

let conn: Connection;

beforeAll(async() => {
  conn = await createTypeormConn();
  const user = await User.create({
    email: casual.email,
    password: casual.password,
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
    expect(response.status).toEqual(200);

    const user = await User.findOne({ where: { id: userId }});
    expect((user as User).confirmed).toBeTruthy();

    const chunks = url.split('/');
    const key = chunks[chunks.length - 1];

    const redisKey = await redis.get(key);
    expect(redisKey).toBeNull();
  });

  it("cannot confirm bad key", async () => {
    const confirmURL = `${process.env.TEST_HOST}/confirm/1234`;
    const response = await fetch(confirmURL);
    expect(response.url === confirmURL).toBeFalsy();
  });
});
