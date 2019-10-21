<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        <ArticleDetails :article="article" :actions="true"></ArticleDetails>
      </div>
    </div>
    <div class="container page">
      <div class="row article-content">
        <div class="col-xs-12">
          <p>{{article.body}}</p>
          <ul class="tag-list">
            <li
            class="tag-default tag-pill tag-outline"
            v-for="(tag, index) of article.tagList"
            :key="tag + index"
            >
            {{ tag }}
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <div class="article-actions">
        <ArticleDetails :article="article" :actions="true"></ArticleDetails>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <CommentEditor
            v-if="isAuthenticated"
            :slug="slug"
            :userImage="currentUser.image"
          >
          </CommentEditor>
          <p v-else>
            <router-link :to="{ name: 'login' }">Sign in</router-link>
            or
            <router-link :to="{ name: 'register' }">sign up</router-link>
            to add comments on this article.
          </p>
          <Comment
            v-for="(comment, index) in comments"
            :slug="slug"
            :comment="comment"
            :key="index"
          >
          </Comment>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import ArticleDetails from "@/components/ArticleDetails";
import Comment from "@/components/Comment";
import CommentEditor from "@/components/CommentEditor";;
export default {
  name: "articleview",
  props: {
    slug: {
      type: String,
      required: true
    }
  },
    data: function() {
        return {
            errors: {},
            currentUser:{},
            tag:""
        };
  },
  components: {
    ArticleDetails,
    Comment,
    CommentEditor,
  },
  beforeRouteEnter(to, from, next) {
    var self= this;
    Promise.all([
    store.dispatch("articles/getArticle", to.params.slug),
    store.dispatch("articles/getComments", to.params.slug)
    ]).then((data) => {
    next();
    });
  },

computed: {
    article() {
      return this.$store.state.articles.article;
    },
    comments() {
      return this.$store.state.articles.comments;
    },
    isAuthenticated() {
      return this.$store.getters["users/isAuthenticated"];
    },
  },
};
</script>