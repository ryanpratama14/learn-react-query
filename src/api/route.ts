import api from "./api";

export const getPosts = async () => {
  const res = await api.get("/posts");
  return res.data as Post[];
};

export const getPostById = async (id: number) => {
  const res = await api.get(`/posts/${id}`);
  return res.data as Post;
};

export const createPost = async (body: Post) => {
  const res = await api.post(`/posts`, body);
  return res.data as Post;
};

export const editPostById = async (id: number, body: Post) => {
  const res = await api.put(`/posts/${id}`, body);
  return res.data as Post;
};
