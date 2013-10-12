/* global describe, it, afterEach, beforeEach, xdescribe, xit */

'use strict';

var expect = require('chai').expect;
var jsd = require('../index');

describe('json-dom', function(){
  var complex = {
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

  describe('getValuesFromPartialPath', function(){
    it('Should return values based on a partial path query', function(){
      var values = jsd.getValuesFromPartialPath(complex, 'articles/hello');
      expect(values[0]).to.equal("it is me you're looking for");
    });

    it('Should not accept anything other than a string or array', function(){
      try{
        var values = jsd.getValuesFromPartialPath(complex, {});
      } catch(e){
        expect(e.message).to.equal('Key must be either an array or string');
      }
    });
  });

  describe('getPathToKey', function(){
    it('Should return a value to a path', function(){
      var paths = jsd.getPathToKey(complex, /hello/);
      var value = jsd.valueFromPath(complex, paths[0]);
      expect(value).to.equal("it is me you're looking for");
    });

    it('Should return a path to a key', function(){
      var paths = jsd.getPathToKey(complex, /hello/);
      expect(paths.length).to.equal(1);
      expect(paths[0]).to.equal('articles/1/hello');
    });
  });

  describe('getValuesByKeyName', function(){
    it('Should find all titles', function(){
      var titles = jsd.getValuesByKeyName(complex, 'title');
      expect(titles.length).to.equal(2);
    });

    it('Should only return the first title', function(){
      var titles = jsd.getValuesByKeyName(complex, 'title', 1);
      expect(titles.length).to.equal(1);
      expect(titles[0]).to.equal(complex.title);
    });

    it('Should get values matching using Regular Expressions', function(){
      var titles = jsd.getValuesByKeyName(complex, /title/);
      expect(titles.length).to.equal(2);
      expect(titles[0]).to.equal('this is a test');
      expect(titles[1]).to.equal('sub title');
    });
  });

  describe('getNodesMatching', function(){
    it('Should find all article nodes', function(){
      var articles = jsd.getNodesMatching(complex, 'articles');
      expect(articles.length).to.equal(2);
      expect(articles[0].length).to.equal(2);
    });

    it('Should reject needles that aren\'t strings or RegExps', function(){
      try {
        var articles = jsd.getNodesMatching(complex, {});
      } catch (e){
        expect(e.message).to.equal('Needle must be either a string or a RegExp');
      }
    });

    it('Should get nodes matching using Regular Expressions', function(){
      var title = jsd.getNodesMatching(complex, /sub/);
      expect(title[0]).to.equal('sub title');
    });
  });
});