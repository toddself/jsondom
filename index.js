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
 * @param  {String}   needle    The value you're looking for
 * @param  {Boolean}  (parents) Should it return the parent of the matching element
 * @return {Array}              An array of parent nodes which have matching children
 */
exports.getNodesMatching = function(tree, needle, parent){
  var nodes = [];
  traverse(tree).forEach(function(nodeValue){
    if(this.key === needle || nodeValue === needle){
      nodes.push(_valueFromKeyArray(tree, this.path, parent));
    }
  });
  return nodes;
};

/**
 * Gets all values from object graph that exist at the specified key name
 * @param  {Object}   tree      Object graph
 * @param  {String}   key       Name of key
 * @param  {Integer} (maxDepth) Max recursion depth
 * @return {Array}              Array of values from matching keys
 */
exports.getValuesByKeyName = function(tree, key, maxDepth){
  if(typeof maxDepth === 'undefined'){
    maxDepth = 0;
  }

  var values = [];
  traverse(tree).forEach(function(nodeValue){
    if(this.key === key){
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