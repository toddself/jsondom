[![build status](https://secure.travis-ci.org/CondeNast/jsondom.png)](http://travis-ci.org/CondeNast/jsondom)

# JSON DOM
A DOM-like interface for querying complex Javascript objects. (Also a very light wrapper around [js-traverse](/substack/js-traverse)).

## Installation

```
npm install jsondom
```

## Usage

```js
> var jsd = require('jsondom');
> var complex = {
  title: "this is a test",
  articles: [
    {
      title: "sub title",
      articles: "this is an article"
    },
    {
      hello: "it is me you're looking for"
    }
  ]
};

> jsd.getValuesByKeyName(complex, 'title');
["this is a test", "sub title"]

> jsd.getValuesByKeyName(complex, 'title', 1);
["this is a test"]

> jsd.getNodesMatching(complex, 'articles');
[
  [
    {
      title: 'sub title',
      articles: 'this is an article'
    },
    {
      hello: 'it is me you\'re looking for'
    }
  ],
  'this is an article'
]

> js.getNodesMatching(complex, 'articles', true);
[ { title: 'this is a test',
    articles: [ [Object], [Object] ] },
  { title: 'sub title',
    articles: 'this is an article' } ]
```

## Methods

### `getNodesMatching(tree, needle, parent)`

```
/**
 * Returns a node of the tree if any of the keys or values in the node match the
 * provided criteria
 * @param  {Object}   tree      Object graph
 * @param  {Mixed}    needle    A string or RegExp describing what to find
 * @param  {Boolean}  (parents) Should it return the parent of the matching element
 * @return {Array}              An array of parent nodes which have matching children
 */
};
```

### `getValuesByKey(tree, key, maxDepth)`

```
/**
 * Gets all values from object graph that exist at the specified key name
 * @param  {Object}   tree       Object graph
 * @param  {Mixed}    key        A RegExp or string for the key you're trying to find
 * @param  {Integer}  (maxDepth) Max recursion depth
 * @return {Array}               Array of values from matching keys
 */
```

## License
Copyright 2013 Condé Nast. Licensed under the MIT License.