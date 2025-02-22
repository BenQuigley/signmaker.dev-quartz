---
title: Personal Scripts
date: 2023-10-20
tags: computing, blog, unix, bash
---

Whether you're a professional software developer or an "I know enough to be
dangerous" power user on a higher education team, writing micro-programs to
automate little tasks is one of the real joys of programming.

Yet, if you're learning programming, you've probably read tutorials about how to
create a Django webserver, a git repository, a personal portfolio page, but may
still have never seen a concrete illustration of how to write your own scripts
and invoke them from your terminal.

For example, here's a fun one from my scripts folder. I open my command line and
type:

```shell
$ word
```

And the output is:

```shell
retiringness
```

My `word` command is a Python script that chooses and prints a random word from
the computer's built-in word list - either `/usr/share/dict/words` on OS X, or
`cracklib-small` on Linux. I'll post this script here so that you can make use
of it yourself if you want to, but the main goal of this blog entry is to
encourage and unblock you to create your own quick scripts to accomplish
absolutely anything you want to do.

I'll give examples in the
[bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) and
[Python](https://en.wikipedia.org/wiki/Python_(programming_language)) languages
for this blog post, which are both great languages to know - bash being the
Buck knife and Python the Leatherman multitool of your digital toolbelt - but
there are many other great languages to do scripting in too. Specifically:

- if you know some other language better and you like it, then you might as well
  use that;
- if you've been following the [DevOps](https://en.wikipedia.org/wiki/DevOps)
  track of your career then you might share (or want to share) that discipline's
  mild bias in favor of the
  [Go](https://en.wikipedia.org/wiki/Go_%28programming_language%29) language.
  
If you're feeling a little indecisive about this, just ignore the feeling and
keep reading! No one's ever sorry that they've learned a little bash or Python.

A few more quick caveats:

- If you're absolutely completely unfamiliar with the shell that's fine; keep
  reading, but although I've done my best to cover the basics there is a lot to
  absorb. [LinuxJourney.com](https://linuxjourney.com/) is a wonderful bookmark
  for uncovering the basics of command-line interfaces.
- If you're on Windows, all the general points here are still true, but you will
  need to either set up Windows Subsystem for Linux in order to do the Unix-type
  tasks that I'm going to talk about here. Alternatively, I'm sure all this
  stuff has some equivalent in
  [Powershell](https://github.com/PowerShell/PowerShell)!
- If you're not on Windows, you already have bash installed, but you may need to
  [install Python](https://realpython.com/installing-python/) before Python
  scripts could be run.
- If you are using [zsh](https://en.wikipedia.org/wiki/Z_shell) as your shell,
  which is the default in some OS X machines, it's `~/.zsh_aliases` instead of
  `~/.bash_aliases`.

### Just lob the quick stuff into ~/.bash_aliases

My `word` script above is a 51-line Python script, but if I were writing it in a
big hurry, it could just live in my `~/.bash_aliases` file as a couple of lines
of bash. It would have to work a little differently on Mac vs. Linux because
their system word list files have different names. Here's an example
`~/.bash_aliases` section for for things that should be defined differently
based on the operating system:

```shell
if [ $OSTYPE == "linux-gnu" ]
then
    alias copy='xclip -sel c'
elif [[ $OSTYPE == "darwin"* ]]
then
    alias copy='pbcopy'
else
    echo "OS type $OSTYPE not recognized; some aliases not set."
fi
```

(Also, if you steal this for your aliases file, then you have a convenient
`copy` command that allows you to copy stuff from the command line to your
normal copy / paste clipboard. Linux users need to install `xclip` before it
will work; I think your normal package manager should have it (`sudo apt install
xclip` on Ubuntu / Debian / Mint / Pop!_OS). Example usage: `cat
~/my-cool-file.txt | copy` copies the contents of your cool file to your
clipboard.)

We can implement `word` easily here by adding the line
`dictionary_filename=cracklib-small` to the Linux section and
`dictionary_filename=words` to the Darwin (OS X) one, then outside of this logic
block, we can add:

```shell
alias word="cat /usr/share/dict/$dictionary_filename | shuf -n 1"
```

It's mind-boggling how much can be accomplished with just bash.

Here are a few more that I use frequently:

```shell
alias hi='git status --short'  # Underrated argument to see a super-casual git status!
alias bra='git branch'
alias cha='git checkout'
alias rai='git fetch; git rebase --interactive origin/develop'
alias ram='git fetch; git rebase --interactive origin/master'
alias rab='git rebase --abort'
alias rac='git rebase --continue'
```

(I would type `git rebase -i` on the command line, but for inscribing into a
scripts file like `~/.bash_aliases`, it's nice to type out the full name of the
argument, for example `--interactive`.)

I also have a few simple functions defined in my `~/.bash_aliases`:

```shell
function names {
  git log -n "$@" --name-only | grep -e "^\S" | grep -Ev "^(commit|Author|Date)" | sort | uniq
}
export -f names
```

The output of this function is the sorted, deduplicated filenames of all the
files that have been changed in the recent 3 git commits (when called with
`names 3`). I couldn't exactly say why this is useful, but I use it a lot.

(The `export -f` line is necessary, or this function would only be available
inside the script, in this case the `~/.bash_aliases` file, itself. We want it
to be available elsewhere in the shell, so we must export it. For whatever
reason, the actual aliases do not work like that.)

And finally, my file contains a code comment with a little note to myself:

```shell
# Reminders
# =========
# Commands that we don't necessarily need aliases for, except that we keep forgetting:
# docker system prune --volumes
# The docker system prune command is a shortcut that prunes images, containers,
# and networks. Volumes are not pruned by default, and you must specify the
# --volumes flag for docker system prune to prune volumes. By default, you are
# prompted to continue. To bypass the prompt, use the -f or --force flag.
```

(I don't know why I write "we" in my system configurations. Nobody's looking at
this stuff except for me. As my friend Darrick said, "What do you mean, 'we'?
Got a mouse in your pocket?")

#### Make aliases for whatever you do a lot
If you enter commands into your command line, they're saved in a file normally
located in `~/.bash_history`(`~/.zsh_history` for zsh users). There are a lot of
uses that the bash shell makes from this, such as auto-completing previously
entered commands (usually with Ctrl+r), but one great use you can make of it is
to make it spit out what are your top 20 most frequently used commands. I
constructed this quickly with some googling, but it works fine on my machines:

```
cat ~/.bash_history | sort | uniq -c | sort -k2nr | tail -n 20
```

Most of mine are already bash aliases. Here are the top 8:

```
 897 rai
 926 git commit
1333 git stash
1404 bra
1435 git commit --amend
3004 django
4037 git add -p
5586 tig
```

The most notable exception to that is the wonderful command-line git client,
[tig](https://jonas.github.io/tig/), which I don't need an alias for because its
name is already so short, and which I more or less live inside of. (Here's to
the next 5,000 invocations!)

So if you have used your command line before, and you run this command, you can
see what you do the most often. If anything in its output is very verbose, it
might be a good candidate for adding an alias for, and saving a few keystrokes.

### Full Scripts
Writing in bash can get tiresome; I do a lot of my quick scripting in Python.
Here's the quick-and-dirty to getting your scripts folder together.

#### How can I sync my scripts across all my computers?
Let's assume that (like me) you are writing general-purpose scripts that you'd
like to be able to use anywhere. I stored my scripts in `~/Dropbox/scripts`
until I migrated from Dropbox to [Mega](https://mega.nz/) because they give you
more storage for free, encrypt your drive for you, and don't look at your stuff;
but you can put yours wherever you want.

#### How can I make my scripts reachable from my shell?
I don't want to have to type `python3 ~/scripts/{script-name}`; I want to type
`{script-name}` only and have it work, regardless of what working directory my
shell is in. To do this, update your `~/.bashrc` to update your PATH variable to
contain your scripts directory:

```shell
export PATH="$PATH:$HOME/mega/scripts"  # replace $HOME/mega/scripts with the path of your scripts folder.
```

Then restart your shell, or `source ~/.bashrc`, in order for the change to take effect.

#### How do I make the script be callable as `name` instead of `name.py`?
To accomplish this, literally just name the script `name` instead of `name.py`.
However, more quick changes are needed:

1. Make the script executable with `chmod +x ~/scripts/name` (or `chmod +x
   ~/scripts/*` to make everything in your scripts folder executable).
2. Make the first line of your script `#!/usr/bin/env python`. This is so that
   your system will know that the executable file `name`, which otherwise just
   contains text, should be executed with the `python3` program, since you're no
   longer calling it with `python3 name.py` as you might be used to.

### Python

Using the `time` command, we can compare the runtime of the quickly implemented shell
version of my `word` script to the pre-existing, Python one:

```shell
$ time cat /usr/share/dict/words | shuf -n 1
Alopecias

real    0m0.030s
user    0m0.018s
sys     0m0.021s
$ time python3 ~/mega/scripts/word
pseudopupal

real    0m0.107s
user    0m0.047s
sys     0m0.031s
```

So there was a real speed improvement to using bare-naked bash as opposed to
Python. But this is not an apples-to-apples comparison - glancing at my existing
`word` script, I remember that it has some niceties that the quick shell version
doesn't have - an `argparse.ArgumentParser` gets us a quick `-h/--help` command,
a few alternative modes, and there's a little joke in there (cribbed from
[xkcd](https://xkcd.com/221/) as well.

I share this script, not because I think you need a script that generates random
words. I just want to plant seeds, especially for readers that might not be
familiar with programming, for concepts that many people add to their personal
scripts that are helpful:

1. Adding a `-h/--help` argument that, when received, prints a help message
   describing all the other options, and then (importantly) closes the program
   without doing its regular function. (As I mentioned above, Python's
   `argparse` module gets you this for free.)
2. Raising errors (which exits the program, in Python) on purpose when the
   script finds itself in a situation that you didn't expect (like, in my case,
   running on a Windows machine where there is no `/usr/share/dict/` directory).
3. Writing your code as simply as possible, and adding comments (the `# ` lines)
   where appropriate and explanatory docstrings (the `"""..."""` lines) to each
   function so that you can remember later what they were supposed to do.
4. Avoid using third-party packages, anything you have to `pip install` from the
   command line. A lot of Python learners are interested in learning Python's
   major analysis tools, such as `numpy` and `pandas`, but (A) your software
   development skills will be much stronger if you learn to use the standard
   library to accomplish simple tasks, and (B) your script will be more useful
   to you if it doesn't always fail the first time you use it until you remember
   you needed to `pip install pandas` on your new OS.

Here's the script:

```python
#!/usr/bin/env python3

"""Print a random word from a word list."""

import argparse
import platform
import random
import time

from typing import Tuple

# The word list that ships with the system:
system = platform.system()
WORD_PATH = "/usr/share/dict"
if system == "Linux":
    WORD_LIST = f'{WORD_PATH}/cracklib-small'
elif system == "Darwin":
    WORD_LIST = f"{WORD_PATH}/words"
else:
    raise Exception(f"Unsupported operating system {system}")


PARSER = argparse.ArgumentParser()
PARSER.add_argument('-b', '--brainstorm', action='store_true')
PARSER.add_argument('-i', '--interval', type=float)
ARGS = PARSER.parse_args()


def generate_list() -> Tuple[str, ...]:
    """Read the word list."""
    try:
        return tuple(open(WORD_LIST).read().split('\n'))
    except Exception:  # pylint: disable=broad-except
        # Chosen by fair dice roll, guaranteed to be random
        return ('saplings',)


def main() -> None:
    """Process the user's args and generate words."""
    words = generate_list()
    if ARGS.interval or ARGS.brainstorm:
        interval = ARGS.interval or 5.0
        while True:
            print(random.choice(words))
            time.sleep(interval)
    else:
        print(random.choice(words))


if __name__ == '__main__':
    main()
```

Thank you for reading! Reach out if you have questions and I'll incorporate your
thoughts into this post.
