<template>
  <div class="article-meta">
      <img :src="article.author.image" />
    <div class="info">
      <span class="author">
        {{ article.author.username }}
      </span>
      <span class="date">{{ formatDate(article.createdAt) }}</span>
    </div>
    <template v-if="isCurrentUser()">
        <span>
            <router-link data-selector= "edit-article" class="btn btn-sm btn-outline-secondary" :to="`/editor/${article.slug}`">
            <i class="ion-edit"></i> <span>&nbsp;Edit Article</span>
            </router-link>
            <span>&nbsp;&nbsp;</span>
            <button data-selector= "btn-delete-article" class="btn btn-outline-danger btn-sm" @click="deleteArticle">
            <i class="ion-trash-a"></i> <span>&nbsp;Delete Article</span>
            </button>
        </span>
    </template>
      <button
        class="btn btn-sm pull-xs-right"
        data-selector= "btn-favorite-article"
        v-on:click="toggleFavorite"
        :class="{
          'btn-primary': article.favorited,
          'btn-outline-primary': !article.favorited
        }"
      >
        <template v-if="article.favorited">
            Unfavorite Article
        </template>
        <template v-else>
            Favorite Article
        </template>
        <span class="counter">({{ article.favoritesCount }}) </span>
      </button>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "ArticleDetails",
  computed: {
    article() {
    return this.$store.state.articles.article;
    },
    currentUser(){
    return this.$store.state.users.user;
    },
    isAuthenticated() {
      return this.$store.getters["users/isAuthenticated"];
    },
  },
  methods: {
    isCurrentUser() {
      if (this.currentUser && this.currentUser.username && this.article.author.username) {
        return this.currentUser.username === this.article.author.username;
      }
      return false;
    },

    formatDate(dateString) {
      return moment(dateString).format("MMMM Do, YYYY");
    },

    toggleFavorite() {
      if (!this.isAuthenticated) {
        this.$router.push({ name: "login" });
        return;
      }
      if(!this.article.favorited){
        this.$store.dispatch("articles/favoriteArticle", this.article.slug);
      }else{
        this.$store.dispatch("articles/unFavoriteArticle", this.article.slug);
      }
    },

    deleteArticle(){
        this.$store.dispatch("articles/deleteArticle", this.article.slug);
        this.$router.push("/")
    }
  }
};
</script>