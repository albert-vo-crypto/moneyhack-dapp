import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [
    {
      title: "NFT01",
      imageSrc:
        "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
      description: "NFT01 description",
      isActive: true,
      estAnnualizedRevenue: 1000000,
    },
    {
      title: "HackMoney",
      imageSrc:
        "https://lh3.googleusercontent.com/vebR8XpqsxUXMeMNx84rYzEyYpldAaa7v0jna_0QqbizbT4SmK8w1E2tzkck-8tHxKsPzO219dacelCZ5v7v25lfZQ=w600",
      description: "ETHGlobal Hackathon",
      isActive: true,
      estAnnualizedRevenue: 3000000,
    },
  ],
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
