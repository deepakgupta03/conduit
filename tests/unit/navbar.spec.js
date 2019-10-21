import { shallowMount } from "@vue/test-utils";
import NavBar from "@/components/NavBar.vue";
import store from "@/store";
import router from "@/router";
let wrapper;

describe("NavBar.vue", () => {
  beforeEach(() => {
    wrapper = shallowMount(NavBar, { store, router });
  });

  it("should show login/register options initially", () => {
    const navItems = wrapper.findAll(".nav-item");
    expect(navItems.length).toBe(3);
  });
});