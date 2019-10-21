import { api, setToken } from "../api";
export default {
  namespaced: true,
  state: {
    feed: [],
    count: 0,
    comments:[],
    article:{},
    tags:[]
  },
  mutations: {
    setArticles(state, { articles, articlesCount }) {
      state.feed = articles;
      state.count = articlesCount;
    },

    setComments(state,{comments}){
        state.comments = comments;
    },

    setArticle(state,{article}){
        state.article = article;
    },

    setTags(state,{tags}){
        state.tags = tags;
    },
  },
  actions: {
    async getGlobalFeed({ commit }, payload = { page: 1 }) {
      let route = "/articles";
      if (payload) {
        const {
          tag = null,
          author = null,
          favorited = null,
          page = 1
        } = payload;
        route += page ? `?offset=${(page - 1) * 10}&limit=10` : "";
        route += tag ? `&tag=${tag}` : "";
        route += author ? `&author=${author}` : "";
        route += favorited ? `&favorited=${favorited}` : "";
      }
      const response = await api.get(route);
      commit("setArticles", response.data);
    },

    async getUserFeed({ commit }, payload = { page: 1 }) {
      let route = "/articles/feed";
      if (payload) {
        const { page = 1 } = payload;
        route += page ? `?offset=${(page - 1) * 10}&limit=10` : "";
      }
      setToken(localStorage.getItem("token"));
      const response = await api.get(route);
      commit("setArticles", response.data);
    },

    async publishArticle({ commit }, data) {
        let route = "/articles";
        setToken(localStorage.getItem("token"));
        try{
          return await api.post(route,  { article: data});
        }catch (e) {
        throw e;
      }
    },

    async updateArticle({ commit }, data) {
        let route = "/articles/"+ data.slug;
        setToken(localStorage.getItem("token"));
        try{
            return await api.put(route, { article: data});
        }catch (e) {
        throw e;
      }
    },

    async deleteArticle({ commit }, slug) {
        let route = "/articles/" + slug;
        setToken(localStorage.getItem("token"));
        await api.delete(route);
    },

    async getArticle({ commit }, slug) {
        let route = "articles/";
        const response = await api.get(route + slug);
        commit("setArticle", response.data);
        return response;
    },

    async postComment({ commit }, data) {
        let route = "/articles/"+data.slug+"/comments";
        setToken(localStorage.getItem("token"));
        const response= await api.post(route,{   comment: {
                body: data.comment
              }});
        this.dispatch("articles/getComments", data.slug);   
    },

    async getComments({ commit }, slug) {
        let route = "articles/";
        const response= await api.get(route +slug+"/comments");
        commit("setComments", response.data);
        return response;
    },    

    async deleteComment({ commit }, data) {
        let route =  "/articles/"+data.slug+"/comments/" + data.commentId;
        setToken(localStorage.getItem("token"));
        await api.delete(route);
        this.dispatch("articles/getComments", data.slug); 
    },

    async favoriteArticle ({ commit }, slug) {
        let route =  "/articles/"+ slug+"/favorite/" ;
        setToken(localStorage.getItem("token"));
        var response = await api.post(route);
        commit("setArticle", response.data);
    },

    async unFavoriteArticle ({ commit }, slug) {
        let route =  "/articles/"+ slug+"/favorite/";
        setToken(localStorage.getItem("token"));
        var response = await api.delete(route);
        commit("setArticle", response.data);
    },

    async getTags({ commit }) {
        let route = "tags/";
        const response = await api.get(route);
        commit("setTags", response.data);
        return response;
    },
  }
};