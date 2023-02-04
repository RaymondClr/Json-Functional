# Json-core
 基于Json2重构的极简Json解析器

## 差异：

| json2                                       | json-core                    | 说明                 |
| ------------------------------------------- | ---------------------------- | -------------------- |
| JSON.stringify(value[, replacer [, space]]) | JSON.stringify(value, space) | 移除了 replacer 功能 |
| JSON.parse(text[, reviver])                 | JSON.parse(text)             | 移除了 reviver 功能  |

## 用法：

```jsx
JSON.stringify({ name: 'box', number: [1, 2, 3] }, 4);
JSON.parse('{ "name": "box", "number": [1, 2, 3] }');
```

