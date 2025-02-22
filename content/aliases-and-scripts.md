---
title: Aliases and Scripts
date: 2024-09-16
tags: computing, blog, bash, unix
draft: false
---
Over the years I've developed (and stolen) a lot of shortcuts and scripts for
accomplishing tasks quickly from the command line. I've written about them
[before](https://signmaker.dev/personal-scripts); it is time now to go further and document all of the absolute best scripts in my possession.

# Aliases

To use these aliases for yourself, copy and paste them into your
`~/.bash_aliases` file (or `~/.zsh_aliases` if you use zsh instead of bash).

## wec

Sometimes I download an image from the Internet but it arrives in the .webp
format, a newfangled image format that often needs to be converted before being
recognized as an image in other utilities (for example, if I'm uploading an
avatar for a web site or game). My bash alias `wec` automatically converts all
webp files in a directory to png files. Requirements:
[imagemagick](https://imagemagick.org/),
[fd-find](https://github.com/sharkdp/fd), and the standard Unix tools
[sed](https://en.wikipedia.org/wiki/Sed) and
[xargs](https://en.wikipedia.org/wiki/Xargs).

```shell
alias wec='fd webp$ | sed "s/.webp$//" | xargs -n1 -I {} dwebp {}.webp -o {}.png'  # webp convert
```

Example usage:

```shell
$ cd Downloads
$ ls
cool-avatar.webp  # Yay, my file I downloaded is here, but it's a webp file
$ wec
Decoded cool-avatar.webp. Dimensions: 421 x 611 . Format: lossy. Now saving...
Saved file cool-avatar.png
$ ls
cool-avatar.webp cool-avatar.png
```

## serg

`sed` can be used as an entire local find-and-replace. I only really use this in
directories where the files are tracked in git / version control, because it can
be a bit risky, otherwise, to bulk change your files unless it's trivial to
revert changes.

```shell
function serg {
  sed -i -e "s/$1/$2/g" $(rg -l "$1")
}
```

Example usage: I use this a lot in software development, e.g. if I've decided to
rename a variable `unload_s3_path` to `s3_table_path` to reflect that "unload"
is no longer the only table-populating strategy:

```shell
serg unload_s3_path s3_table_path
```

## today

My alias `today` creates a directory called `~/today/` in my home folder if it
does not exist, and within it, creates a subfolder `~/today/2024-09-16/` if it
does not exist. Then it outputs the name, which (since I tend to run this from
emacs) allows me to jump straight into that new directory with `g f`. I store
all kinds of things in there, typically just
[org](https://en.wikipedia.org/wiki/Org-mode) files with simple to-do lists and
other notes.

```shell
function today() {
    TODAY_DIR="$HOME/today/"
    DATE_DIR=$(date +'%Y-%m-%d')
    if [ ! -d  $TODAY_DIR$DATE_DIR ];
    then
        mkdir -p $TODAY_DIR$DATE_DIR
    fi;
    echo $TODAY_DIR$DATE_DIR
}
export today
```

Example usage:

```shell
$ today
/home/signmaker/today/2024-09-16
vi ~/today/2024-09-16/hotfix.txt
```

(I'm sorry if you're the redditor or Mastodonian I stole this script from. I
tried to find you in order to give credit but wasn't able to.)

# Scripts

When a task that I need automated is too complex to express as one or two lines
of bash, I store it in `~/mega/scripts/`, a directory that is synced across my
computers. Here's all the information you need to adopt one of them (after
copying the script itself into a file in your own scripts directory):

1. These scripts are accessible in any directory, just as if they were a
   bash_alias, because the following line is always in my `~/.bashrc` (or
   `~/.zshrc` if I were to use zsh):
   ```
   export PATH="$PATH:$HOME/mega/scripts"
   ```
2. I also, when I add a new script to this directory, or install the directory
   onto a new computer, need to run the following
   [chmod](https://en.wikipedia.org/wiki/Chmod) command to make each script
   executable:
   ```
   chmod +x ~/mega/scripts/*
   ```
3. My scripts use [Python](https://www.python.org/), so Python needs to be installed.

## age

Starting off simple - I frequently forget, or feel uncertainty, about my
own age! But there is no need to be:

```python
#!/usr/bin/python3
"""Output my current age."""
import datetime

years = datetime.datetime.now() - datetime.datetime(year=1987, month=4, day=26)
print(round(years.days / 365, 2))
```

Example usage:

```shell
$ age
37.42
```

## reminders

Even simpler, this is just a list of things that I benefit greatly from being
able to quickly remind myself:

- The incantations to make [ripgrep](https://github.com/BurntSushi/ripgrep)
  omit certain parts of its typical output
- Date and datetime formatting syntax for Python
- The syntax to quickly print "foo='bar'" in Python, given a variable `foo`
  containing the value `"bar"`
- The magic strings used for the
  [tabulate](https://github.com/astanin/python-tabulate) library
- Commands to open a postgresql shell from its docker container
- Command to instantiate a pandas dataframe with a couple of rows of sample data
  

```python3
#!/usr/bin/env python3
"""I still always forget certain things."""
reminders = """
rg options: -o/--only-matching; -I no filename; -N no line number
strftime: %Y-%m-%d %H:%M:%S; or month words %B/%b; weekdays %A/%a
f-string tricks: f"{foo=}"; f"{num:.2f}"
tabulate kwargs: tablefmt=(default "simple", github", "markdown", "orgtbl", "plain", "rounded_grid")
sql shell: postgres (alias for docker exec -it postgres /bin/bash); then psql -U {username} -d {database}
dataframe: df = pd.DataFrame({"Name": ["John", "Alice", "Bob"], "Age": [25, 30, 35], "City": ["New York", "London", "Paris"]})
""".strip()
print(reminders)
```

## sleeep

[sleep](https://en.wikipedia.org/wiki/Sleep_(command)) is a frequently useful
command, but when invoking it from the shell (for example in order to run `say
"Job's done"` when 3 minutes have elapsed), I find myself wondering "Are we
there yet?" My script `sleeep` does the same thing as `sleep`, except that it
prints a counter for how many seconds have elapsed.

```python
#!/usr/bin/python3
"""Count down a user-specified number of seconds."""
import sys
import time

try:
    to_sleep = int(sys.argv[1])
except (IndexError, TypeError):
    print("usage: sleeep seconds")
    sys.exit(1)
for second in range(to_sleep):
    print(second, end="\r")
    time.sleep(1)
print(to_sleep)
```

## exc

This script converts back and forth between Excel's column nomenclature (e.g.
"A", "B", "C", ..., "Z", "AA", "AB", ...) and indexes in a Python list. It
becomes useful when switching back and forth between Excel and Python, for
example, when programming a script to generate a copy of a spreadsheet. When the
list of columns becomes long enough, it's very convenient to be able to quickly
identify that the 33rd column is "AH", or that column CAZ is column 2079.

```python
#!/usr/bin/env python3
"""Convert from Excel column lettering to 0-indexes or back."""
import sys


def column_to_index(column):
    """Convert Excel column name to 0-indexed integer."""
    index = 0
    for char in column:
        index = index * 26 + (ord(char) - ord("A") + 1)
    return index - 1  # because it's 0-indexed


def index_to_column(index):
    """Convert 0-indexed integer to Excel column name."""
    column = ""
    while index >= 0:
        column = chr(index % 26 + ord("A")) + column
        index = index // 26 - 1
    return column


arg = sys.argv[1]

if arg.isalpha():  # Check if the input is an alphabetical column name
    print("Index", column_to_index(arg))
elif arg.isnumeric():  # Check if the input is a numeric index
    print("Column", index_to_column(int(arg)))
```

Example usage:

```shell
$ exc 33
Column AH
$ exc CAZ
Index 2079
```
