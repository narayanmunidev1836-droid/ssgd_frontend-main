// import { createSlice } from "@reduxjs/toolkit";

// const audioSlice = createSlice({
//   name: "audio",
//   initialState: {
//     currentSongIndex: 0,
//     isPlaying: false,
//     currentTime: 0,
//   },
//   reducers: {
//     setAudioState: (state, action) => {
//       return {
//         ...state,
//         ...action.payload,
//       };
//     },
//   },
// });

// export const { setAudioState } = audioSlice.actions;
// export const selectAudioState = (state) => state.audio;

// export default audioSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const audioSlice = createSlice({
  name: "audio",
  initialState: {
    currentSongIndex: 0,
    isPlaying: false,
    currentTime: 0,
  },
  reducers: {
    setAudioState: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setAudioState } = audioSlice.actions;

export const selectAudioState = (state) => state.audio;

export default audioSlice.reducer;
