import Vuex from "vuex";
import Cookies from "js-cookie"

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts;
      },
      addPost(state, post) {
        state.loadedPosts.push(post)
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(
          post => post.id === editedPost.id
        );
        state.loadedPosts[postIndex] = editedPost
      },
      setToken(state, token) {
        state.token = token
      },
      clearToken(state) {
        state.token = null;
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return context.app.$axios
          .$get("posts.json")
          .then(data => {
            const postsArray = [];
            for (const key in data) {
              postsArray.push({ ...data[key], id: key });
            }
            vuexContext.commit("setPosts", postsArray);
          })
          .catch(e => context.error(e));
      },
      addPost(vuexContext, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        }
        return this.$axios
          .$post("posts.json?auth=" + vuexContext.state.token, createdPost)
          .then(data => {
            vuexContext.commit('addPost', { ...createdPost, id: data.name })
          })
          .catch(e => console.log(e));
      },
      editPost(vuexContext, editedPost) {
        return this.$axios.$put("posts/" +
          editedPost.id +
          ".json?auth=" + vuexContext.state.token, editedPost)
          .then(res => {
            vuexContext.commit("editPost", editedPost)
          })
          .catch(e => console.log(e));
        //hadhika ken matemchilich mrigula deja ma3neha ba3d mana3mil edit w nenzel 3ala button save 
        //tatla3li matbadletech fil les listes mta3 les items 7asilou makgré 3maltha mrigula normalment 
        //ba3d ma3adech yemchi chay mofo mabadaelt chay
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit("setPosts", posts);
      },
      authenticateUser(vuexContext, authData) {
        let authUrl = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" + process.env.fbAPIKey
        if (!authData.isLogin) {
          authUrl = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" +
            process.env.fbAPIKey
        }
        return this.$axios
          .$post(
            authUrl,
            {
              isLogin: authData.isLogin,
              email: authData.email,
              password: authData.password,
              returnSecureToken: true
            }
          )
          .then(authData => {
            console.log(authData);
            vuexContext.commit("setToken", authData.idToken);
            localStorage.setItem("token", authData.idToken);
            localStorage.setItem("expirationDate", new Date().getTime() + Number.parseInt(authData.expiresIn) * 1000);

            Cookies.set("jwt", authData.idToken);
            Cookies.set("expirationDate", new Date().getTime() + Number.parseInt(authData.expiresIn) * 1000);

            return this.$axios.$post("http://localhost:3000/api/track-data", {data: "authenticated!"});

          })
          .catch(e => console.log(e));
      },
      initAuth(vuexContext, req) {
        let token;
        let expirationDate;
        if (req) {
          if (!req.headers.cookie) {
            return;
          }
          const jwtCookie = req.headers.cookie
            .split(";").find(c => c.trim().startsWith("jwt="));
          if (!jwtCookie) {
            return;
          }
          token = jwtCookie.split("=")[1];
          expirationDate = req.headers.cookie
            .split(";").find(c => c.trim().startsWith("expirationDate=")).split("=")[1];
        } else {
          token = localStorage.getItem("token");
          expirationDate = localStorage.getItem("expirationDate");
        }
        if (new Date().getTime() > Number.parseInt(expirationDate) || !token) {
          console.log("token invalid or expired");
          vuexContext.dispatch("logout");
        }
      },
      logout(vuexContext) {
        vuexContext.commit("clearToken");
        Cookies.remove("jwt");
        Cookies.remove("expirationDate");
        if(process.client){
          localStorage.removeItem("token");
          localStorage.removeItem("expirationDate");
        }
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },
      isAuthenticated(state) {
        return state.token != null;
      }
    }
  });
};

export default createStore;