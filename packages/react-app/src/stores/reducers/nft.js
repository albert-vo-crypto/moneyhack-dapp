import { createSlice } from "@reduxjs/toolkit";
import { getTestNFTProjects } from "../../models/nftproject";

const initialState = {
  projects: getTestNFTProjects(),
  selectedProject: null,
};

const slice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    projectsUpdatedAction: (state, action) => {
      state.projects = action.payload;
    },
    selectedProjectUpdatedAction: (state, action) => {
      state.selectedProject = action.payload;
    },
  },
});

export const { projectsUpdatedAction, selectedProjectUpdatedAction } = slice.actions;

export const nftStateSelector = state => state.nft;
export const nftProjectsSelector = state => state.nft.projects;
export const nftSelectedProjectSelector = state => state.nft.selectedProject;

export default slice.reducer;
