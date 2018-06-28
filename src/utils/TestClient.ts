import * as rp from 'request-promise';

export class TestClient {
  url: string;

  options: {
    jar: any,
    withCredentials: boolean,
    json: boolean
  }

  constructor(url: string) {
    this.options = {
      withCredentials: true,
      jar: rp.jar(),
      json: true
    }
    this.url = url;
  }

  async _request(query: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query
      }
    })
  }

  async forgotPasswordChange(newPassword: string, key: string) {
    return this._request(`
        mutation {
          forgotPasswordChange(newPassword: "${newPassword}", key: "${key}") {
            path
            message
          }
        }
      `
    );
  }

  async register(email: string, password: string) {
    return this._request(`
      mutation {
        register(email: "${email}", password: "${password}") {
          path
          message
        }
      }
    `);
  };

  async login(email: string, password: string) {
    return this._request(`
        mutation {
          login(email: "${email}", password: "${password}") {
            path
            message
          }
        }
      `
    );
  }

  async logout() {
    return this._request(`
        mutation {
          logout
        }
      `
    );
  }

  async me() {
    return this._request(`
        {
          me {
            id
            email
          }
        }
      `
    );
  }

  async users() {
    return this._request(`
      query {
        users {
          id
          email
        }
      }
    `);
  }

  async user(id: string) {
    return this._request(`
      query {
        user(id: "${id}") {
          id
          email
          firstName
          lastName
        }
      }
    `);
  }


  async updateUser(id: string, firstName: string, lastName: string) {
    return this._request(`
      mutation {
        updateUser(id: "${id}", firstName: "${firstName}", lastName: "${lastName}") {
          ... on Error {
            path
            message
          }
          ... on User {
            id
            email
            firstName
            lastName
          }
        }
      }
    `);
  }

  async createTask(userId: string, title: string, description: string) {
    return this._request(`
      mutation {
        createTask(userId: "${userId}", title: "${title}", description: "${description}") {
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
    `);
  }


  async tasksByUser(userId: string) {
    return this._request(`
      query {
        tasksByUser(id: "${userId}") {
          id
          title
          description
          creator {
            id
            email
          }
        }
      }
    `);
  }

  async tasks() {
    return this._request(`
      query {
        tasks {
          id
          title
          description
        }
      }
    `);
  }

  async upForGrabsTasks() {
    return this._request(`
      query {
        upForGrabsTasks{
          title,
          creator{
            email
          }
        }
      }
    `);
  }

  async assignTask(taskId: string, userId: string) {
    return this._request(`
      mutation {
        assignTask(taskId:"${taskId}", userId:"${userId}") {
          path
          message
        }
      }
    `);
  }

  async tasksForUser(userId: string) {
    return this._request(`
      query {
        tasksForUser(id:"${userId}"){
          asignee{
            id
          },
          title
        }
      }
    `);
  }

  async task(taskId: string) {
    return this._request(`
      query {
        task(id: "${taskId}") {
          id
          title
          description
        }
      }
    `);
  }

  async deleteTask(taskId: string) {
    return this._request(`
      mutation {
        deleteTask(id: "${taskId}") {
          path
          message
        }
      }
    `);
  }

  async createOnDemandTaskResolution(taskId: string, description: string) {
    return this._request(`
      mutation {
        createOnDemandTaskResolution(taskId:"${taskId}", description:"${description}") {
          path
          message
        }
      }
    `);
  }

  async onDemandTaskResolutions() {
    return this._request(`
      query {
        onDemandTaskResolutions {
          description
          id
          achieved
          task{
            title
            description
            id
          }
        }
      }
    `);
  }
}
