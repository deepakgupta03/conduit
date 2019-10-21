<template>
  <div class="article-preview">
    <div class="article-meta">
      <a href="profile.html"><img :src="article.author.image"/></a>
      <div class="info">
        <a href="" class="author">{{ article.author.username }}</a>
        <span class="date">{{ formatDate(article.createdAt) }}</span>
      </div>
      <button class="btn-sm pull-xs-right"
        v-on:click="toggleFavorite"
        :class="{
          'btn-primary': article.favorited,
          'btn-outline-primary': !article.favorited
        }">
        <i class="ion-heart"></i> {{ article.favoritesCount }}
      </button>
    </div>
    <router-link :to="`/article/${article.slug}`" class="preview-link">
      <h1>{{ article.title }}</h1>
      <p>{{ article.description }}</p>
      <span>Read more...</span>
      <ul class="tag-list">
        <span
        class="tag-default tag-pill tag-outline"
        v-for="(tag, index) of article.tagList"
        :key="tag + index"
        >
        {{ tag }}
        </span>
    </ul>
    </router-link>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: ["article"],
  computed:{
    isAuthenticated() {
      return this.$store.getters["users/isAuthenticated"];
    },
  },
  methods: {
    formatDate(dateString) {
      return moment(dateString).format("MMMM Do, YYYY");
    },

    toggleFavorite() {
      if (!this.isAuthenticated) {
        this.$router.push({ name: "login" });
        return;
      }
      this.article.favorited = !this.article.favorited;
      if(this.article.favorited){
        this.$store.dispatch("articles/favoriteArticle", this.article.slug);
        this.article.favoritesCount++;
      }else{
        this.$store.dispatch("articles/unFavoriteArticle", this.article.slug);
        this.article.favoritesCount--;
      }
    }
  }
};
</script>