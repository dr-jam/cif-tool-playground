/// <reference path="typings/d3/d3.d.ts" />

module CiFViz {
  export class PracticeViewer {

    base: d3.Selection<any>;

    constructor(elementID: HTMLDivElement) {
        console.log(d3.version);
        console.log(elementID);
        //get the base SVG
        this.base = d3.select(elementID);
        if(this.base.empty()) {
          console.log("Selection for base was empty.")
        }
        console.log(this.base);
        this.base.style("width", "600px");
        this.base.style("height", "480px");
        this.base.style("background-color", "#555566")
    }

    public render(data: any[]) {

    }

  }
}
