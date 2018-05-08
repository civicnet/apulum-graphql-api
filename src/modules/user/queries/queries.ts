export const valid_email = "foobar@example.com";
export const valid_password = "1234";

export const userCreation = (e: string, p: string) => `
  mutation {
    register(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

export const usersQuery = () => `
    query {
      users {
        id
        email
      }
    }
`;

export const userQuery = (id: string) => `
    query {
      user(id: "${id}") {
        id
        email
      }
    }
`;
