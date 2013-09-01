'use strict';
var traverse = require('traverse');

/**
 * Takes an array of nodes to the content location and returns the value located
 * at that point. Can we used to return the parent node as well.
 * @private
 * @param  {Object}   tree        Object graph
 * @param  {Array}    key_array   An array of keys, traversable from the left
 * @param  {Boolean}  (getParent) Flag to return parent or element. Default: element
 * @return {Mixed}                The content located at that point in the tree
 */
function _valueFromKeyArray(tree, key_array, getParent){
  if(getParent){
    key_array.splice(key_array.length-1, 1);
  }

  return key_array.reduce(function(acc, el){
    return acc[el];
  }, tree);
}

/**
 * Returns a node of the tree if any of the keys or values in the node match the
 * provided criteria
 * @param  {Object}   tree      Object graph
 * @param  {Mixed}    needle    A string or RegExp describing what to find
 * @param  {Boolean}  (parents) Should it return the parent of the matching element
 * @return {Array}              An array of parent nodes which have matching children
 */
exports.getNodesMatching = function(tree, needle, parent){
  var nodes = [];
  var exp;

  if(typeof needle === 'string'){
    exp = new RegExp('^'+needle+'$');
  } else if (needle instanceof RegExp){
    exp = needle;
  } else {
    throw new Error('Needle must be either a string or a RegExp');
  }

  traverse(tree).forEach(function(nodeValue){
    var keyMatch = typeof this.key === 'string' && this.key.match(exp);
    var nodeMatch = typeof nodeValue === 'string' && nodeValue.match(exp);
    if(keyMatch || nodeMatch){
      nodes.push(_valueFromKeyArray(tree, this.path, parent));
    }
  });
  return nodes;
};

/**
 * Gets all values from object graph that exist at the specified key name
 * @param  {Object}   tree      Object graph
 * @param  {Mixed}    key       A RegExp or string for the key you're trying to find
 * @param  {Integer} (maxDepth) Max recursion depth
 * @return {Array}              Array of values from matching keys
 */
exports.getValuesByKeyName = function(tree, key, maxDepth){
  var exp;
  if(typeof maxDepth === 'undefined'){
    maxDepth = 0;
  }

  if(typeof key === 'string'){
    exp = new RegExp('^'+key+'$');
  } else if (key instanceof RegExp){
    exp = key;
  } else {
    throw new Error('Key must be either a string or a RegExp');
  }

  var values = [];
  traverse(tree).forEach(function(nodeValue){
    if(typeof this.key === 'string' && this.key.match(exp)){
      if(maxDepth){
        if(this.level <= maxDepth){
          values.push(nodeValue);
        }
      } else {
        values.push(nodeValue);
      }
    }
  });

  return values;
};