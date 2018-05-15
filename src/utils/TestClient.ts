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
        query: query
      }
    })
  }

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
}
