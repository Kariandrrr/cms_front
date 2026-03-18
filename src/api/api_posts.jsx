import api from '../api/axiosinstance';

export const postsAPI = {
    getPosts: (params) => api.get('/posts/', { params }),

    createPost: (data) => api.post('/posts/', data),

    getMyPosts: (params) => api.get('/posts/my', { params }),

    getArchive: (params) => api.get('/posts/archive', { params }),

    getPostById: (id) => api.get(`/posts/${id}`),

    updatePost: (id, data) => api.put(`/posts/${id}`, data),

    deletePost: (id) => api.delete(`/posts/${id}`),

    publishPost: (id) => api.patch(`/posts/${id}/publish`),

    getPostBySlug: (slug) => api.get(`/posts/slug/${slug}`),

    restorePost: (id) => api.put(`/posts/${id}/restore`),

    archivePost: (id) => api.put(`/posts/${id}/archive`),
};
export default postsAPI;