Hello world:

```html
<script>
let name = getone(`select name from user`)
</script>

<p>Hello, $name</p>
```

Optimistic updates:

```html
<script>
let counter = query(`select value from counter`)
let userid = query(`select userid from user`)

function increment() {
  execute(q`update counter set value = value + 1 where userid = {userid}`)

  # or 
  execute(q`update counter set value = value + 1`)
}
</script>

<button on:click={increment}>{counter}</p>
```
