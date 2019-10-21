<template>
    <div class="editor-page">
    <div class="container page">
        <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
            <ul class="error-messages">
                <li v-for="(value, key) in errors" :key="key">
                <span v-text="key" />
                <span v-for="err in value" :key="err" v-text="err" />
                </li>
            </ul>
            <form>
            <fieldset>
                <fieldset class="form-group">
                    <input type="text" v-model="article.title" class="form-control form-control-lg" placeholder="Article Title">
                </fieldset>
                <fieldset class="form-group">
                    <input type="text" v-model="article.description" class="form-control" placeholder="What's this article about?">
                </fieldset>
                <fieldset class="form-group">
                    <textarea class="form-control" v-model="article.body" rows="8" placeholder="Write your article (in markdown)"></textarea>
                </fieldset>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="tag"
                  v-on:keypress.enter.prevent="addTag(tag)"
                />
                <div class="tag-list">
                  <span
                    class="tag-default tag-pill"
                    v-for="(tag, index) of article.tagList"
                    :key="tag + index"
                  >
                    <button class="ion-close-round" v-on:click="removeTag(tag)">x</button>
                    {{ tag }}
                  </span>
                </div>
                <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click="publish">
                    Publish Article
                </button>
            </fieldset>
            </form>
        </div>

        </div>
    </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data: function() {
        return {
            errors: {},
            article:{tagList : []},
            tag:""
        };
  },
  methods: {
    publish() {

      this.$store
        .dispatch("articles/publishArticle", this.$data.article)
        .then(({ data }) => {
          this.$router.push({
            name: "article",
            params: { slug: data.article.slug }
          });
        })
        .catch(({ response }) => {
          this.errors = response.data.errors;
        });
    },

    removeTag(tag) {
       this.article.tagList = this.article.tagList.filter(t => t !== tag);
    },

    addTag(tag) {
      this.article.tagList = this.article.tagList.concat([tag]);
    }
  }
};
</script>