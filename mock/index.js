var glob = require('glob');
var fs = require('fs');
;

module.exports = function mock() {
  if (process.env.MOCK === 'open') {
    let mockFile = glob.sync("mockData/**/*.json");
    let memo = mockFile.reduce((memo, item) => {
      const json = require('../' + item);

      let arr = Object.keys(json).map(key => {
        let str = key.split(' ')
        return {
          methods: str[0].toLocaleLowerCase(),
          url: str[1],
          data: json[key]
        }
      })
      return [
        ...memo,
        ...arr
      ];
    }, []);
    return memo;
  }
}