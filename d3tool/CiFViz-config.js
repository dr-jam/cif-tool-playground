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
		"validate": "lib/Validate",


		//social practice
		"practiceManager" : "lib/PracticeManager",

    //viz code
		"d3": "lib/d3",
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
    },
		d3: {
			exports: "d3"
		}
	}
});

require(["cif", "practiceViewer", "assetLoader"],
  function(cif, practiceViewer, assetLoader) {
    assetLoader.loadAssets();
		console.dir(practiceViewer);
		console.dir(practiceViewer.CiFViz);
    pv =  new practiceViewer.CiFViz.PracticeViewer(document.getElementById("practiceViewerBase"));

  });
