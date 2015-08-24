/** @jsx React.DOM */
// Configure require.js and set paths to modules used.
require.config({
	paths: {
		// Note that the file paths omit the ".js" from the filename.
		"jquery": "lib/jquery-1.11.3.min",
    "util": "lib/util",
    "log": "lib/log",
    "test": "lib/Tests",
    "underscore": "lib/underscore",

		// CiF
		"cif": "lib/CiF",
		"sfdb": "lib/SFDB",
		"volition": "lib/Volition",
		"ruleLibrary": "lib/RuleLibrary",
		"actionLibrary": "lib/ActionLibrary",


		//social practice
		"practiceManager" : "lib/PracticeManager",

    //viz code
    "assetLoader" : "AssetLoader",
    "practiceViewer": "practiceViewer"

	},

	// Shims let certain libraries that aren't built with the module pattern interface with require.js Basically they tell require.js what global variable the given library will try to export all its functionality to, so require.js can do with that what it will.
	shim : {
    jquery: {
      exports: "$"
    },
    underscore: {
      exports: "_"
    }
	}
});

require(["cif", "practiceViewer"],
  function(cif, practiceViewer) {
    loadAssets();
    pv = new CiFViz.PracticeViewer(document.getElementById("practiceViewerBase"));

  });
