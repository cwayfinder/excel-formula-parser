# Entities
There are 4 types of entity
- function - IF, NOT, EQ, etc.
- variable
- path - absolute (starts with '/') or relative (starts with './' or '../')
- value - true, false, 5, 'John Brown', [1,2,3] - basically anything that is not formula, variable or path

# Parse formula and get AST

```ts
const excel = new Excel();
excel.parse(`=EQ(/person/firstName, true)`);
excel.parse(`=AND(EQ(firstName, 'John'), EQ(lastName, 'Brown'))`);
```

# Generate HTML for syntax highlighting
**Example 1:**
```ts
const excel = new Excel();
excel.toHtml(`=EQ(/person/firstName, true)`);
```

Output:
```html
<div>=<span class="function">EQ</span><span class="paren-deep-1">(</span><span class="path">/person/firstName</span>, <span class="value">true</span><span class="paren-deep-1">)</span></div>
```

**Example 2:**
```ts
const excel = new Excel();
excel.toHtml(`=AND(EQ(firstName, 'John'), EQ(lastName, 'Brown'))`);
```

Output:
```html
<div>=<span class="function">AND</span><span class="paren-deep-1">(</span><span class="function">EQ</span><span class="paren-deep-2">(</span><span class="variable">firstName</span>, <span class="value">'John'</span><span class="paren-deep-2">)</span>, <span class="function">EQ</span><span class="paren-deep-3">(</span><span class="variable">lastName</span>, <span class="value">'Brown'</span><span class="paren-deep-3">)</span><span class="paren-deep-1">)</span></div>
```

**Example 3 (incomplete formula):**
```ts
excel.toHtml(`=NOT(EQ(lega`, true);
```

Output:
```html
<div>=<span class="function">NOT</span><span class="paren-deep-1">(</span><span class="function">EQ</span><span class="paren-deep-2">(</span><span class="variable">lega</span></div>
```
