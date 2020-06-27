import { getRoutes } from "@/http/api.js";
import { filterAsyncRoutes } from "@/common/router/asyncRouter.js";
import { clone } from "@/common/utils/data/clone";

const state = {
  selectedProject: []
};

const mutations = {
  SelectedProject: (state, projects) => {
    state.selectedProjectList = projects;
    sessionStorage.setItem("SelectedProjects", data);
  }
};

const actions = {
  saveSelectedProject(state, data) {
    commit("SelectedProject", data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
