var assert = require('assert')

var addWith = require('../')

var sentinel = {}
var sentinel2 = {}
describe('addWith("obj", "console.log(a)")', function () {
  it('adds the necessary variable declarations', function (done) {
    var src = addWith('obj', 'console.log(a)')
    // var a = obj.a;console.log(a)
    Function('console,obj', src)(
      {
        log: function (a) {
          assert(a === sentinel)
          done()
        }
      },
      {a: sentinel})
  })
})
describe('addWith("obj || {}", "console.log(a)")', function () {
  it('adds the necessary variable declarations', function (done) {
    var src = addWith('obj || {}', 'console.log(a)')
    // var locals = (obj || {}),a = locals.a;console.log(a)
    var expected = 2
    Function('console,obj', src)(
      {
        log: function (a) {
          assert(a === sentinel)
          if (0 === --expected) done()
        }
      },
      {a: sentinel})
    Function('console,obj', src)(
      {
        log: function (a) {
          assert(a === undefined)
          if (0 === --expected) done()
        }
      })
  })
})
describe('addWith("obj", "console.log(helper(a))", ["helper"])', function () {
  it('adds the necessary variable declarations', function (done) {
    var src = addWith('obj', 'console.log(helper(a))', ['helper'])
    // var a = obj.a;console.log(helper(a))
    Function('console,obj,helper', src)(
      {
        log: function (a) {
          assert(a === sentinel)
          done()
        }
      },
      {a: sentinel2},
      function (a) {
        assert(a === sentinel2)
        return sentinel
      })
  })
})
describe('addWith("obj || {}", "console.log(locals(a))", ["locals_"])', function () {
  it('adds the necessary variable declarations', function (done) {
    var src = addWith('obj || {}', 'console.log(locals(a))', ['locals_'])
    // var locals__ = (obj || {}),locals = locals__.locals,a = locals__.a;console.log(locals(a))
    Function('console,obj', src)(
      {
        log: function (a) {
          assert(a === sentinel)
          done()
        }
      },
      {
        a: sentinel2,
        locals: function (a) {
          assert(a === sentinel2)
          return sentinel
        }
      })
  })
})