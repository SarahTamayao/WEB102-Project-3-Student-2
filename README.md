# Web Development Project 3 - *Computer Science Trivia*

Submitted by: **dganesh05**

This web app is a small, responsive flashcard-style trivia application that tests basic computer science concepts. Users can read a question, type a guess before flipping the card, and receive immediate feedback. The app includes navigation, shuffle, streak tracking, and a way to mark cards as "mastered" so they are removed from the active study pool.

Time spent: ~4 hours

## Required Features

The following **required** functionality is completed:

- [x] **The user can enter their guess into an input box *before* seeing the flipside of the card**
  - Application features a clearly labeled input box with a submit button where users can type in a guess
  - Clicking on the submit button with an **incorrect** answer shows visual feedback that it is wrong
  - Clicking on the submit button with a **correct** answer shows visual feedback that it is correct
- [x] **The user can navigate through an ordered list of cards**
  - A forward/next button displayed on the card navigates to the next card in a set sequence when clicked
  - A previous/back button displayed on the card returns to the previous card in the set sequence when clicked
  - Both the next and back buttons have a visual disabled state at the beginning/end of the list and do not wrap around

## Optional Features Implemented

- [x] Users can use a shuffle button to randomize the order of the cards
  - Cards remain in the same (original) sequence unless the Shuffle button is clicked. Clicking Shuffle produces a new random sequence and resets the position.
- [x] A user’s answer may be counted as correct even when it is slightly different from the target answer
  - Matching is tolerant: answers are normalized (case/punctuation removed), partial/token overlap is accepted, and a small fuzzy (Levenshtein) tolerance is used for minor typos.
- [x] A counter displays the user’s current and longest streak of correct responses
  - Current streak increments on a correct guess and resets on an incorrect guess.
  - Longest streak updates automatically when the current streak exceeds it.
- [?] A user can mark a card that they have mastered and have it removed from the pool of displayed cards
  - Marked/mastered cards are removed from the active study pool and appear as badges in the header; they can be unmarked to return to the pool.

## Additional Features / Improvements

- Fixed-height, responsive card layout so the card doesn't resize awkwardly with different text lengths.
- A tolerant matching function combining normalization, token overlap and Levenshtein fuzzy matching.
- Mastered cards display as compact badges in the header with an '✕' button to unmark.
- Visual feedback states for correct/incorrect answers and card-level coloring per category.
- Cleaned up header spacing and responsive tweaks for better viewing on small screens.

## How to run

1. Install dependencies and start the dev server:

```cmd
npm install
npm run dev
```

2. Open the URL printed by Vite (usually http://localhost:5173) and interact with the app.

## Video Walkthrough

<img src='flashcard-app - Brave 2025-10-06 22.39.43.gif' title='Video Walkthrough' alt='Video Walkthrough' />

## Notes / Challenges

- Implementing tolerant matching required balancing permissiveness (accept partial/typo answers) with avoiding false positives. I used normalization (lowercase, remove punctuation), token overlap, and a small Levenshtein threshold.
- Managing application state (order, shuffle, mastered set, streaks) needed careful coordination so UI updates (like removing a mastered card) didn't leave the position index out of range.
- Styling adjustments (fixed card height, master badges in header) improved the UX but required responsive tuning across breakpoints.

## License

    Copyright 2025 dganesh05

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
