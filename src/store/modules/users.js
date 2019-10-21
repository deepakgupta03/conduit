import { api, setToken, clearToken } from "../api";
export default {
  namespaced: true,
  state: {
    user: null,
    profile: null
  },
  getters: {
    username(state) {
      return (state.user && state.user.username) || null;
    },
    isAuthenticated(state){
      return !!localStorage.getItem("token");
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setProfile(state, payload){
      state.profile = payload;
    },
    setToken(state, payload) {
        state.token = payload;
      },
  },
  actions: {
    getUser: async function({ commit }) {
      const user = await api.get("/user");
      commit("setUser", user);
    },

    loginUser: async function({ commit }, { email, password }) {
      clearToken();
      try {
        const response = await api.post("/users/login", {
          user: {
            email,
            password
          }
        });
        if (response.data.user) {
          setToken(response.data.user.token);
          commit("setUser", response.data.user);
          localStorage.setItem("token", response.data.user.token); 
        }
      } catch (e) {
        throw e;
      }
    },

    register: async function({ commit }, data) {
        clearToken();
        try {
          const response = await api.post("/users", {
            user: data
          });
          if (response.data.user) {
            setToken(response.data.user.token);
            commit("setUser", response.data.user);
            localStorage.setItem("token", response.data.user.token); 
          }
        } catch (e) {
          throw e;
        }
    },

    fetchProfile: async function({ commit }, username) {
        const response = await api.get("/profiles/"+username);
        commit("setProfile", response.data.profile);
        return response;
    },

    updateUser: async function({ commit }, payload) {
        const { email, username, password, image, bio } = payload;
        const user = {
        email,
        username,
        bio,
        image
        };
        if (password) {
        user.password = password;
        }
        setToken(localStorage.getItem("token"));
        const response = await api.put("/user/",user);
        commit("setUser", response.data.user);
        return response;
    },

    logout: async function({ commit }, payload) {
        commit("setUser",{});
        localStorage.clear();
    }
  }
};