var loadAssets = function () {
  var cif = CiF.cifInterface;

  var loadResult = cif.init();

  //Load in our schema, cast, triggerRules and volitionRules, and actions.
  var rawSchema = cif.loadFile("data/schema.json");
  var schema = cif.loadSocialStructure(rawSchema);

  var rawCast = cif.loadFile("data/cast.json");
  var cast = cif.addCharacters(rawCast);
  var castInfo = addCharacterInfo(rawCast);

  console.log("Here is our cast! " , cast);

  var microtheoriesToLoad = ["deceive", "deny", "dominance", "helpful", "hospitable", "indifferent", "reluctant"];

  $.each(microtheoriesToLoad, function(index, value) {
    cif.addRules(cif.loadFile("data/microtheories/" + value + ".json"));
  });

  console.log(ruleLibrary.getRuleSetNames());

  var rawHistory = cif.loadFile("data/history.json");
  var history = cif.addHistory(rawHistory);

  var rawTestPractice = cif.loadFile("data/practices/AskForWater.json");
  var testPractice = practiceManager.addPractice(rawTestPractice);

  //cif.dumpSFDB();

  cast = cif.getCharacters();
}
