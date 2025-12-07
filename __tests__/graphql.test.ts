import axios from 'axios';

const API_URL = 'http://localhost:3001/graphql';

interface Author {
  id: number;
  first_name: string;
  last_name: string;
}

interface Post {
  id: number;
  title: string;
}

interface GraphQLResponse<T> {
  data: T;
}

describe('GraphQL API', () => {
  it('should fetch a list of authors', async () => {
    const response = await axios.post<GraphQLResponse<{ authors: { list: Author[]; count: number } }>>(
      API_URL,
      {
        query: `
          query {
            authors(limit: 5) {
              list {
                id
                first_name
                last_name
              }
              count
            }
          }
        `,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const { data } = response.data;

    expect(data.authors.list.length).toBeLessThanOrEqual(5);
    expect(data.authors.count).toBeGreaterThan(0);
  });

  it('should fetch a specific author by ID', async () => {
    const response = await axios.post<GraphQLResponse<{ authors: { list: Author[] } }>>(
      API_URL,
      {
        query: `
          query {
            authors(id: 1) {
              list {
                id
                first_name
                last_name
              }
            }
          }
        `,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const { data } = response.data;

    expect(data.authors.list[0].id).toBe(1);
  });

  it('should fetch a list of posts', async () => {
    const response = await axios.post<GraphQLResponse<{ posts: { list: Post[]; count: number } }>>(
      API_URL,
      {
        query: `
          query {
            posts(limit: 5) {
              list {
                id
                title
              }
              count
            }
          }
        `,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const { data } = response.data;

    expect(data.posts.list.length).toBeLessThanOrEqual(5);
    expect(data.posts.count).toBeGreaterThan(0);
  });

  it('should fetch a specific post by ID', async () => {
    const response = await axios.post<GraphQLResponse<{ posts: { list: Post[] } }>>(
      API_URL,
      {
        query: `
          query {
            posts(id: 1) {
              list {
                id
                title
              }
            }
          }
        `,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const { data } = response.data;

    expect(data.posts.list[0].id).toBe(1);
  });
});