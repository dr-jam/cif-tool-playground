/// <reference path="typings/d3/d3.d.ts" />

module CiFViz {
  export class PracticeViewer {

    private _baseSVG: d3.Selection<any>;

    constructor() {
        console.log(d3.version);

        //get the base SVG
        this._baseSVG = d3.select("practiceViewerBase");
        this._baseSVG.style("background-color", "#555555");
        this._baseSVG.style("width", "600px");
        this._baseSVG.style("height", "480px");
    }

    public render(data: any[]) {
      
    }

  }
}
