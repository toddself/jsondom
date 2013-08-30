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

  it('Should find all titles', function(){
    var titles = jsd.getValuesByKeyName(complex, 'title');
    expect(titles.length).to.equal(2);
  });

  it('Should only return the first title', function(){
    var titles = jsd.getValuesByKeyName(complex, 'title', 1);
    expect(titles.length).to.equal(1);
    expect(titles[0]).to.equal(complex.title);
  });


  it('Should find all article nodes', function(){
    var articles = jsd.getNodesMatching(complex, 'articles');
    expect(articles.length).to.equal(2);
    expect(articles[0].length).to.equal(2);
  });
});