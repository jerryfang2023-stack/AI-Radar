# Bad VW Clamp Example

```css
.column-title {
  font-size: clamp(44px, 8vw, 96px);
  line-height: 1.05;
}
```

Why it fails: a column page title is using hero-scale responsive type, which breaks the fixed position hierarchy.
