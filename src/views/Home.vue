<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a
                  class="nav-link"
                  v-if="username"
                  @click="setFeed('user')"
                  :class="{ active: activeFeed === 'user' }"
                  >Your Feed</a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  @click="setFeed('global')"
                  :class="{ active: activeFeed === 'global' }"
                >Global Feed</a>
              </li>
              <template v-if="tag">
                <li class="nav-item">
                  <a
                    class="nav-link"
                    @click="setFeed('tag')"
                    :class="{ active: activeFeed === 'tag' }"
                    >#{{tag}}</a>
                </li>
              </template>
            </ul>
          </div>

          <ArticlePreview v-for="article in articles" :key="article.slug" :article="article"></ArticlePreview>

          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                v-for="page in pages"
                :data-test="`page-link-${page}`"
                :key="page"
                :class="{ active: page === activePage }"
                @click.prevent="changePage(page)">
                <a class="page-link" href v-text="page" />
              </li>
            </ul>
          </nav>
        </div>
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <a
                class="tag-default tag-pill"
                v-for="(tag, index) in tags"
                :key="index"
                @click="setTag(tag)"
              >{{tag}}
              </a>
            </div>
          </div>
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
    this.$store.dispatch("articles/getTags");
  },
  methods: {
    setFeed(feedType, page) {
      if (!page) {
        this.activePage = 1;
      }
      if (feedType === "global") {
        this.activeFeed = "global";
        this.$store.dispatch("articles/getGlobalFeed", { page: page });
      } else if (feedType === "user") {
        this.activeFeed = "user";
        this.$store.dispatch("articles/getUserFeed", { page: page });
      } else if (feedType === "tag") {
        this.activeFeed = "tag";
        this.$store.dispatch("articles/getGlobalFeed", {
          tag: this.tag,
          page: page
        });
      }
    },
    setTag(tagName) {
      this.tag = tagName;
      this.setFeed("tag");
    },
    changePage(page) {
      this.activePage = page;
      this.setFeed(this.activeFeed, page);
    }
  },
  created() {
    this.setFeed("global");
    this.activePage = 1;
  },
  computed: {
    articles() {
      return this.$store.state.articles.feed || [];
    },
    username() {
      return this.$store.getters["users/username"];
    },
    tags() {
      return this.$store.state.articles.tags;
    },
    pages() {
      return this.$store.state.articles.count
        ? Array(Math.ceil(this.$store.state.articles.count / 10))
            .fill()
            .map((v, i) => i + 1)
        : [];
    }
  },
  data: function() {
    return {
      activeFeed: "global",
      tag: ""
    };
  }
};
</script>