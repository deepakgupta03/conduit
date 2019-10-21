<template>
  <div class="card">
    <div class="card-block">
      <p class="card-text">{{ comment.body }}</p>
    </div>
    <div class="card-footer">
      <a href="" class="comment-author">
        <img :src="comment.author.image" class="comment-author-img" />
      </a>
      <span class="comment-author">
        {{ comment.author.username }}
      </span>
      <span class="date-posted">{{ formatDate(comment.createdAt) }}</span>
      <span v-if="isLoggedInUser" class="mod-options">
        <button type="button" class="btn btn-default btn-sm" v-on:click="deleteComment(slug, comment.id)">
          <span class="glyphicon glyphicon-trash"></span> Delete 
        </button>
      </span>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "Comment",
  props: {
    slug: { type: String, required: true },
    comment: { type: Object, required: true }
  },
  computed: {
    isLoggedInUser() {
      if (this.$store.state.users.user.username && this.comment.author.username) {
        return this.comment.author.username === this.$store.state.users.user.username;
      }
      return true;
    },
  },
  methods: {
    formatDate(dateString) {
      return moment(dateString).format("MMMM Do, YYYY");
    },
    deleteComment(slug, commentId) {
      this.$store.dispatch("articles/deleteComment", { slug, commentId });
    }
  }
};
</script>