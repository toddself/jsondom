'use strict';
var traverse = require('traverse');

/**
 * Takes an array of nodes to the content location and returns the value located
 * at that point. Can we used to return the parent node as well.
 * @param  {Object}   tree        Object graph
 * @param  {Array}    key_array   An array of keys, traversable from the left
 * @param  {Boolean}  (getParent) Flag to return parent or element. Default: element
 * @return {Mixed}                The content located at that point in the tree
 */
var valueFromPath = exports.valueFromPath = function(tree, key_array, getParent){
  if(typeof key_array === 'string'){
    key_array = key_array.split('.');
  }

  if(getParent){
    key_array.splice(key_array.length-1, 1);
  }

  return key_array.reduce(function(acc, el){
    return acc[el];
  }, tree);
};

/**
 * Cohearses `expr` into a RegExp or throws an error if it can't
 * @private
 * @param  {Mixed}  expr RegExp or string.
 * @return {Object}      Strict Regular Expression version of string
 */
function _regExpOrGTFO(expr){
  var exp;

  if(typeof expr === 'string'){
    exp = new RegExp('^'+expr+'$');
  } else if (expr instanceof RegExp){
    exp = expr;
  } else {
    throw new Error('Needle must be either a string or a RegExp');
  }

  return exp;
}

/**
 * Gets the path to a particular key in the Object
 * @param  {Object} tree Object graph
 * @param  {Mixed}  key  String or RegExp
 * @return {Array}       Array of decimal separated paths to object suitable to
 *                       use with valueFromKeyPath
 */
exports.getPathToKey = function(tree, key){
  var paths = [];

  var exp = _regExpOrGTFO(key);

  traverse(tree).forEach(function(nodeValue){
    if(typeof this.key === 'string' && this.key.match(exp)){
      paths.push(this.path.join('.'));
    }
  });

  return paths;
};

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
  var exp = _regExpOrGTFO(needle);

  traverse(tree).forEach(function(nodeValue){
    var keyMatch = typeof this.key === 'string' && this.key.match(exp);
    var nodeMatch = typeof nodeValue === 'string' && nodeValue.match(exp);
    if(keyMatch || nodeMatch){
      nodes.push(valueFromPath(tree, this.path, parent));
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
  var exp = _regExpOrGTFO(key);
  if(typeof maxDepth === 'undefined'){
    maxDepth = 0;
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