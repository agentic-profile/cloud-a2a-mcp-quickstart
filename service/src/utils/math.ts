import { create, all } from "mathjs";

const math = create(all)
const limitedEvaluate = math.evaluate

math.import({
  // most important (hardly any functional impact)
  'import':     function () { throw new Error('Function import is disabled') },
  'createUnit': function () { throw new Error('Function createUnit is disabled') },
  'reviver':    function () { throw new Error('Function reviver is disabled') },

  // extra (has functional impact)
  'evaluate':   function () { throw new Error('Function evaluate is disabled') },
  'parse':      function () { throw new Error('Function parse is disabled') },
  'simplify':   function () { throw new Error('Function simplify is disabled') },
  'derivative': function () { throw new Error('Function derivative is disabled') },
  'resolve':    function () { throw new Error('Function resolve is disabled') },
}, { override: true })

//console.log(limitedEvaluate('sqrt(16)'))     // Ok, 4
//console.log(limitedEvaluate('parse("2+3")')) // Error: Function parse is disabled

export default limitedEvaluate;