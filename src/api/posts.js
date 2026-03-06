import api from './api';

export const postsAPI = {
  getPosts: (params = {}) => {
    return api.get('/posts/', { params });
  },

  getPost: (id) => {
    return api.get(`/posts/${id}`);
  },

  createPost: (postData) => {
    return api.post('/posts/', postData);
  },

  updatePost: (id, postData) => {
    return api.put(`/posts/${id}`, postData);
  },

  deletePost: (id) => {
    return api.delete(`/posts/${id}`);
  },

  publishPost: (id) => {
    return api.patch(`/posts/${id}/publish`);
  },

  getMyStats: () => {
    return api.get('/posts/my/stats');
  }
};