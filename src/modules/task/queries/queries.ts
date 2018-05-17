export const valid_title = "Lorem ipsum";
export const valid_description = "Description for days here, quite a long one";

export const creationMutation = (u: string, t: string, d: string) => `
mutation {
  createTask(userId: "${u}", title: "${t}", description: "${d}") {
    ... on Error {
      path
      message
    }
    ... on Task {
      id
      title
      description
    }
  }
}
`;

export const deletionMutation = (id: string) => `
mutation {
  deleteTask(id: "${id}") {
    path
    message
  }
}
`;

export const tasksQuery = () => `
query {
  tasks {
    id
    title
    description
  }
}
`;

export const singleTaskQuery = (id: string) => `
query {
  task(id: "${id}") {
    id
    title
    description
  }
}
`;

export const tasksByUserQuery = (id: string) => `
query {
  tasksByUser(id: "${id}") {
    id
    title
    description
    creator {
      id
      email
    }
  }
}
`;

export const upForGrabsQuery = () => `
query {
  upForGrabsTasks{
    title,
    creator{
      email
    }
  }
}
`;

export const tasksForUser = (id: string) => `
query{
  tasksForUser(id:"${id}"){
    asignee{
      id
    },
    title
  }
}
`;

export const assignTaskMutation = (tid: string, uid: string) => `
mutation{
  assignTask(taskId:"${tid}", userId:"${uid}") {
    path
    message
  }
}
`;
