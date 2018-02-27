# 基于 jQuery 的日期选择器

[点我查看demo](https://hileix.github.io/xDatePicker/)

### 例子
```html
<div class="input-wrap">
  <input type="text">
</div>
```
```javascript
$('.input-wrap input').xDatePicker({
  format: '/',
  placement: 'bottom-start'
});
```

### 文档
`$('inputElement').xDatePicker(options)`

options

|   | 描述| 默认值|
| :---------- | :-----------|:-----------|
| format   | 时间格式 `string`  | xxxx年xx月xx日   |
| placement   | 控件位置 `string`  | bottom-start   |
