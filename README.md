# POP-QUIZ
QUIZ APP
PopQuiz is a game-show-themed quiz app built with vanilla HTML, CSS, and JavaScript. Pick a category, race a 10-second countdown, and earn a spot on the local leaderboard.

## Features

- Four quiz categories: General Knowledge, Science, Coding, and History
- Five questions per round
- 10-second countdown per question with an animated timer ring
- Instant correct and incorrect answer feedback
- Persistent top-5 leaderboard with `localStorage`
- Responsive design for mobile, tablet, and desktop
- No frameworks, packages, or external libraries


## How it works

1. Select a quiz category and optionally enter a name.
2. Answer each question before the timer reaches zero.
3. Each answer is marked immediately; the correct answer is always revealed.
4. At the end of the round, the score is saved if it belongs in the top five.

The leaderboard is stored in the browser under the `popquiz-leaderboard-v1` localStorage key. Clearing site data removes saved scores.


## Customize questions

Edit the `QUESTION_BANK` object near the top of `script.js`. Each question follows this format:

```js
["Question text", ["Option 1", "Option 2", "Option 3", "Option 4"], correctOptionIndex]
```

`correctOptionIndex` starts at `0`; for example, `2` means the third option is correct.

## Tech stack

- HTML5
- CSS3
-  JavaScript
