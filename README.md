VICTOK

# CUSTOM CSS

0. npm install -g less
1. cd node_modules/antd/dist
2. touch custom.less
3.

```
@import "./antd.less";
@primary-color: #162D59;
@font-face {
font-family: 'Pretendard';
src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-dynamic-subset.css');
}
```

4. lessc --js custom.less ../../../src/Utils/custom.css
