---
title: 01 - Quick Start
---

## Prerequisites
Like most projects there are some things needed before you can use it.

- Hugo Extended (extended edition, v0.117.0 or later)
    - Check with `hugo version`
- Git
- Go (if using Hugo modules)

## Create A Site

### As Hugo Module
```sh
hugo new site quickstart
cd quickstart
hugo mod init github.com/<your_user>/<your_project>
echo "theme = ['github.com/enchant97/hugo-mysti-guides']" >> hugo.toml
```

### Git Submodule
```sh
hugo new site quickstart
cd quickstart
git init
git submodule add https://github.com/enchant97/hugo-mysti-guides.git themes/mysti-guides
echo "theme = ['mysti-guides']" >> hugo.toml
```

### Adding Content
By default "Mysti Guides" uses different directory names for different content types. Anything not in these directories will just use a default theme suitable for generic content. The formats is shown below:

- blog
    - allows you to make a blog
- docs
    - make some documentation for your project

```text
content/
    blog/
        ...
    docs/
        ...
    _index.md
```
