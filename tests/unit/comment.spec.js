import { shallowMount } from "@vue/test-utils";
import Comment from "@/components/Comment.vue";
let wrapper;
let mockStore;

describe("Comment.vue", () => {
  beforeEach(() => {
    mockStore = {
        state: {
          users: {
              user:{
                  username : "test"
              }
          }
        },
        dispatch: jest.fn()
      };
    wrapper = shallowMount(Comment, {   propsData: {
        slug: 'article1',
        comment:{
            id:1,
            body: "body",
            author:{
                image: "",
                username:"test"
            },
            createdAt: new Date()
        }
      },
      mocks: {
        $store: mockStore
      }
    });
  });

  it("should show comment body", () => {
    const comment = wrapper.find(".card-text");
    expect(comment.text()).toBe("body");
  });

  it("should render author name correctly", () => {
    const commentAuthor = wrapper.findAll(".comment-author");
    expect(commentAuthor.length).toBe(2);
  });

  it("should render created date", () => {
    const comment = wrapper.findAll(".date-posted");
    expect(comment.length).toBe(1);
  });

  it("should render delete button correctly", () => {
    const comment = wrapper.findAll(".btn");
    expect(comment.length).toBe(1);
  });

  it("should call deleteComment method on delete button click", async () => {
    wrapper.find('button').trigger('click')
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      "articles/deleteComment", { slug :"article1",  commentId : 1 } );
  });
  
});