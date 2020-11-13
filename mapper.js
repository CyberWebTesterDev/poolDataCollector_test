const Dictionary = require("./dict/localDict.json");
const BIKdictionary = require("./dict/bic.json");

//dictionary helper

//поиск значений справочных записей

class MapperDict {
  detectDictionaryRecord = uid => {
    let dict = null;
    let idx = -1;
    let value = null;

    for (let key in Dictionary) {
      if (Dictionary[key].findIndex(el => el.id === uid) !== -1) {
        idx = Dictionary[key].findIndex(el => el.id === uid);
        dict = key;
        value = Dictionary[key][idx].xpath;
      }
    }

    return [idx, dict, value];
  };

  detectBicDictionaryRecord = uid => {
    let bic = null;
    let idx = -1;
    let value = null;

    for (let key in BIKdictionary) {
      if (BIKdictionary[key].findIndex(el => el.id === uid) !== -1) {
        idx = BIKdictionary[key].findIndex(el => el.id === uid);
        bic = BIKdictionary[key][idx].bic;
        value = BIKdictionary[key][idx].xpath;
      }
    }

    return [idx, bic, value];
  };
}

exports.MapperDict = MapperDict;
