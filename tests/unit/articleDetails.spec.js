import router from "@/router";
import { shallowMount } from "@vue/test-utils";
import ArticleDetails from "@/components/ArticleDetails.vue";
import sinon from 'sinon'
let wrapper;
let mockStore;

describe("ArticleDetails.vue", () => {
  beforeEach(() => {
    mockStore  = {
        state: {
          users: {
              user:{
                  username : "test"
              }
          },
          articles:{
              article:{
                body: "article body",
                createdAt: "2019-10-19T04:46:44.411Z",
                description: "article description",
                favorited: true,
                favoritesCount: 2,
                slug: "article1",
                tagList: [],
                title: "article title",
                author:{
                    image: "",
                    username:"test"
                },
              }
          }
        },
        getters: {
            "users/isAuthenticated": true
          },
        dispatch: jest.fn()
      };
      wrapper = shallowMount(ArticleDetails,{ mocks: {
        $store: mockStore
      }});
  });

  it("should render author name correctly", () => {
    const articleAuthor = wrapper.findAll(".author");
    expect(articleAuthor.length).toBe(1);
  });

  it("should render created date", () => {
    const articleCreatedDate = wrapper.findAll(".date");
    expect(articleCreatedDate.length).toBe(1);
  });

  it("should render edit article button correctly", () => {
    const articleEdit = wrapper.findAll('[data-selector= "edit-article"]');
    expect(articleEdit.length).toBe(1);
  });

  it("should render delete article button correctly", () => {
    const deleteArticleBtn = wrapper.findAll('[data-selector= "btn-delete-article"]');
    expect(deleteArticleBtn.length).toBe(1);
  });

  it("should render favourite button correctly", () => {
    const favoriteButton = wrapper.findAll('[data-selector= "btn-favorite-article"]');
    expect(favoriteButton.length).toBe(1);
  });

  it("should call deleteArticle on delete button click", async () => {
    wrapper.find('[data-selector= "btn-delete-article"]').trigger('click');
    expect(mockStore.dispatch).toHaveBeenCalledWith(
        "articles/deleteArticle" , "article1")
  });

  it("should call unfavorite on unfavorite button click", async () => {
    wrapper.find('[data-selector= "btn-favorite-article"]').trigger('click')  
    expect(mockStore.dispatch).toHaveBeenCalledWith(
        "articles/unFavoriteArticle","article1" )
  });

  it("should call favorite on favorite button click", async () => {
    mockStore.state.articles.article.favorited = false;
    wrapper.find('[data-selector= "btn-favorite-article"]').trigger('click')  
    expect(mockStore.dispatch).toHaveBeenCalledWith(
        "articles/favoriteArticle","article1" )
  });
});