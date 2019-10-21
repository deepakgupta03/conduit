<template>
<div class="profile-page">

  <div class="user-info">
    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>
            <div>
              <router-link
                class="btn btn-sm btn-outline-secondary action-btn"
                :to="{ name: 'settings' }"
              >
                <i class="ion-gear-a"></i> Edit Profile Settings
              </router-link>
            </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">

      <div class="col-xs-12 col-md-10 offset-md-1">
        <div class="articles-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
                <a
                  class="nav-link"
                  v-if="username"
                  @click="setFeed('user');"
                  :class="{ active: activeFeed === 'user' }"
                >
                  My Articles
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  @click="setFeed('favorite');"
                  :class="{ active: activeFeed === 'favorite' }"
                >
                  Favorited Articles
                </a>
              </li>
          </ul>
        </div>

         <ArticlePreview
            v-for="article in globalArticles"
            :key="article.slug"
            :article="article"
          ></ArticlePreview>

    </div>
  </div>
</div>
</div>
</template>
<script>
import ArticlePreview from "@/components/ArticlePreview.vue";
export default {
  components: {
    ArticlePreview
  },
  mounted() {
    this.$store.dispatch("users/fetchProfile", this.$route.params.username);
  },
  methods: {
    setFeed(feedType, page) {
      if(!page){
          this.activePage = 1;
      }
      if (feedType === "favorite") {
        this.activeFeed = "favorite";
        this.$store.dispatch("articles/getGlobalFeed",{page :page,favorited:this.$route.params.username});
      } else if (feedType === "user") {
        this.activeFeed = "user";
        this.$store.dispatch("articles/getGlobalFeed",{page: page,author:this.$route.params.username});
      }
    },
    changePage(page){
        this.activePage = page;
        this.setFeed(this.activeFeed, page);
    }
  },
  created() {
    this.setFeed("favorite");
    this.activePage = 1;
  },
  computed: {
    globalArticles() {
      return this.$store.state.articles.feed || [];
    },
    username() {
      return this.$store.getters["users/username"];
    },
    pages(){
      return this.$store.state.articles.count? Array(Math.ceil(this.$store.state.articles.count/10)).fill().map((v,i)=>i+1) :[];
    },
    profile(){
      return this.$store.state.users.profile;
    },
  },
  data: function() {
    return {
      activeFeed: "global"
    };
  }
};
</script>