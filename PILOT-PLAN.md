# Assessment pilot plan (draft)

Goal: find out whether the assessment separates real developers by level well enough to put a
public certificate on it. Start with Frontend Developer, the only live track.

## Questions to answer

1. Does the score order people the way their real level does (junior < mid < senior < expert)?
2. Is the 50% pass mark right, or do strong people fail and weak people pass?
3. Which questions are bad: ambiguous, too easy, too hard, or not separating strong from weak?
4. Can the test be cheated cheaply (lookup, AI, shared answers)?

## Participants (target 30, minimum 20)

- 6 to 8 per level, with level set by an outside source, not self-claim: a hiring manager's
  assessment, a job title plus years of experience, or a reviewed portfolio.
- Mix of employers' staff, bootcamp graduates and freelancers. Include at least 5 people who
  are not developers as a no-knowledge control.
- Paid or incentivized, and told this is a test of the test, not of them.

## Method

1. Each participant takes the assessment at the level they honestly claim, on a fresh account.
2. Record per attempt: total score, per-question answers and time, claimed vs external level.
3. Short exit survey: Did the questions feel fair? Which felt wrong or ambiguous? Did they look
   anything up?
4. A reviewer who is a senior developer marks every question flagged "second defensible answer"
   (about 70, see HANDOFF item 2) as keep, fix or drop, before the pilot starts.
5. Run a separate check for cheating: have 3 people take it with an AI assistant allowed and
   record scores and time.

## Analysis

- Plot score by external level. Healthy result: clear steps, little overlap between adjacent
  levels, and non-developers at or near chance (25%).
- Item analysis: drop or fix questions that nearly everyone gets right or wrong, or where strong
  scorers miss it more than weak scorers.
- Pass-mark check: share of true-level people who pass at the pass mark, and share of one-level-
  below people who pass. Aim for at least 80% and at most 20%.
- Promotion rule check: how many people are promoted a level, and do reviewers agree.
- AI-assisted scores: if they match expert scores, the certificate needs stronger integrity
  controls before it is shown publicly.

## Decision rules

- Ship the public certificate as "Passed the SkillSift <level> assessment" only if levels
  separate and the pass-mark check holds.
- If the AI-assisted run scores like experts, hold the public share links until integrity
  controls (proctoring signals, practical task) exist.
- Anything that fails goes back to question review, then a second smaller pilot.

## Timeline

- Week 1: review the flagged questions, recruit participants.
- Week 2: run attempts, collect surveys.
- Week 3: analysis, fix or drop items, set the pass mark and level wording.
- Week 4: re-run with 5 to 10 people to confirm, then decide on launch.

## Open items

- Who recruits and pays participants.
- How external level is established for each person.
- Whether to add a practical task for senior and expert before the pilot or after.
