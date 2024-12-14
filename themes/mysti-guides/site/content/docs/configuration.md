---
title: 02 - Configuration
---

## Hugo Config
The examples use YAML.

### Menus

- main (top left)
- sub (top right)

```yaml
menu:
  main:
    - name: Home
      url: /
  sub:
    - name: Repository
      params:
        icon: "git-branch"
        hideName: true
      url: "https://example.com"
```

### Highlighting
To ensure the code highlighting works as expected ensure all styling is using classes.

```yaml
markup:
  highlight:
    noClasses: false
```

### Adding Favicon(s)

```yaml
params:
  favicon:
    - href: favicon.svg
    - href: favicon.png
      type: image/png
      sizes: 256x256
    - href: favicon@small.png
      type: image/png
      sizes: 16x16
```
