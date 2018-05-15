import axios from 'axios';
import { loginMutation } from '../../login/queries/queries';

export const meQuery = `
{
  me {
    id
    email
  }
}
`;

export const loginAndQueryMeTest = async (
  email: string,
  pass: string,
  userId: string
) => {
  await axios.post(
    process.env.TEST_HOST as string,
    {
      query: loginMutation(email, pass)
    },
    {
      withCredentials: true
    }
  );

  const response = await axios.post(
    process.env.TEST_HOST as string,
    {
      query: meQuery
    },
    {
      withCredentials: true
    }
  );

  expect(response.data.data).toEqual({
    me: {
      id: userId,
      email: email
    }
  });
}

export const noCookieTest = async (withCredentials: boolean) => {
  const response = await axios.post(
    process.env.TEST_HOST as string,
    {
      query: meQuery
    },
    {
      withCredentials: withCredentials
    }
  );

  expect(response.data.data.me).toBeNull();
}
