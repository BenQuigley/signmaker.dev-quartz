---
title: Refinements from magit
date: 2023-12-31
tags: emacs, computing, blog
---

Unlike most emacs users, I haven't wholeheartedly adopted magit as my sole
interface for git. I mostly stick to the command line, in the coziness of my
aliases - 

```shell
alias bra='git branch'
alias cha='git checkout'
alias rai='git fetch; git rebase --interactive origin/develop'
alias rab='git rebase --abort'
alias rac='git rebase --continue'
alias hi='git status --short'
alias hii='git status --long'
```

\- and a few helper functions. However, I do open magit often, partly because
emacs is always already open, but also because magit's configurations are deeply
clever.

For this blog post, I wanted to delve into how magit's default behaviors are so
well-thought-out that it can be instructive to explore them. If I no longer had
access to magit, I would still keep these four habits in my workflow:

## --force-with-lease is better than --force
I learned at my first engineering job - at EditShare, a shop where git fluency
was somewhat more important than at your standard web dev shop because we
maintained several live branches of our code - the helpfulness of typing
`--force-with-lease` instead of `--force`, using `--force` / `-f` only when all
else failed. It's helpful because, if some collaborator has pushed a fix commit
to your branch while you commited something else and are about to force push,
your force push will obliterate the collaboration unless git warns you there
are upstream changes that you don't have. Git gives that warning only if you use
`--force-with-lease`:

```
error: failed to push some refs to '{repository}'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
```

Unfortunately, `-f` is 16 characters shorter than  `--force-with-lease`, so it's
easy to default to `-f` on the command line. With magit-push, though,
`--force-with-lease` is more the default - `-f` is the key activating
force-with-lease and `-F` activates force mode, so users who take hints from
magit about how they should use git are fs trained to prefer the safer and
better option.

## Name your branch's upstream
In a case of a magit feature not only surpassing the git CLI, but actually making
it easier to use, magit makes it very convenient to set a branch's upstream,
giving you an option to set it when pushing or pulling from a branch.

It's great for a branch's upstream to be set because then you can use `git pull`
(or `magit-pull`) on that branch more easily. With bare git, only under certain
specific circumstances will the upstream be set automatically. git has no way to
know that your local branch named `hotfix` is actually related to the `hotfix`
on GitHub of the same name.

## Name your stashes
When doing a `git stash` from magit, there are a lot of options to choose from,
most of which I don't use. The next step, is the option to give your stash a
name, like "WIP notes API" or "tentative-test-refactor".

Before I used magit, I didn't know it was an option to add a message to a stash,
but reviewing the output of `git stash --help`, it is:

```
COMMANDS
       push [-p|--patch] [-S|--staged] [-k|--[no-]keep-index] [-u|--include-untracked] [-a|--all] [-q|--quiet] [(-m|--message)
       <message>] [--pathspec-from-file=<file> [--pathspec-file-nul]] [--] [<pathspec>...]
           Save your local modifications to a new stash entry and roll them back to HEAD (in the working tree and in the index).
           The <message> part is optional and gives the description along with the stashed state.
```

Thanks to the magit developers for the lesson.

It's extremely convenient to be able to stash something without worrying about losing
it in a pile of stashed things.

## Reverting hunks is easy
Reverting an entire commit is usually easy (find the commit's hash in `git log`
and then run `git revert {commit-hash}`), but reverting a single fragment of a
commit? Hard to do from the command line - the easiest way I can think of is to
interactive rebase back to the commit in question (with `edit` or `break`), and
then rewrite the code and add a new commit, or amend it.

None of that is automatic, and it would be quite laborious compared to reverting
the hunk in magit. When the user is reviewing `magit-revision`, magit gives a
`reverse` option with the keystroke `v`. That's it!

One shouldn't have to rewrite history to use one's version control system to
undo a fragment of a change record.
