/// <reference path="typings/d3/d3.d.ts" />
/// <reference path="typings/requirejs/require.d.ts"/>
/// <reference path="typings/cif/PracticeManager.d.ts" />

/// <amd-dependency path="lib/require.js"/>
/// <amd-dependency path="practiceManager"/>

import d3 = require("d3");

//old way that does not work -- kept for reference!
//import practiceManager = require("practiceManager");
//module practiceManager { var n : number; };

var practiceManager = require("practiceManager");


export module CiFViz {


  interface ISocialPractice{
      label : string;
      entryStage: IStage;
      stages: IStage[];
  }

  interface IStage {
    label: string;
    eventStage: boolean;
    nextStages: IStage[];
    preconditions: ICondition[];
    actions: IAction[];
  }

  interface IAction {
    label: string;
    defaultWeight: number;
    intent: string;
    performance: string;
    preconditions: ICondition[];
    carryRules: IWeightedRule[];
    nowRules: IWeightedRule[];
    effects: IEffect[];
  }

  interface IPredicate {
    class: string;
    type: string;
    first: string;
    second?: string;
    value?: number | boolean;
    weight?: number;
    intentDirection?: boolean;
    isIntent?: boolean;
  }

  interface ICondition extends IPredicate {
    value: number | boolean;
  }

  interface IEffect extends IPredicate {
    value: number | boolean;
  }

  interface IVolitionEffect extends IPredicate {
    weight: number;
  }

  interface IRule {
    name: string;
    conditions: ICondition[];
    effects: IVolitionEffect[] | IEffect[];
  }

  interface IWeightedRule {
    name: string;
    conditions: ICondition[];
    effects: IVolitionEffect[];
  }

  interface ITriggerRule {
    name: string;
    conditions: ICondition;
    effects: IEffect[];
  }

  function getStageByName(name: string):ISocialPractice {
    var practice : ISocialPractice;
    var practices : ISocialPractice[] = practiceManager.getPractices();
    for (var practiceIndex : number = 0; practiceIndex < practices.length; practiceIndex++) {
      if(name === practices[practiceIndex].label) {
        return practices[practiceIndex];
      }
    }
    return undefined;
  }

  export class PracticeViewer {

    base: d3.Selection<any>
    width = 960;
    height = 500;
    colors = d3.scale.category10();

    constructor(elementID: HTMLDivElement) {


      console.log(d3.version);
      console.log(elementID);
      //get the base SVG
      this.base = d3.select(elementID);
      if(this.base.empty()) {
        console.log("Selection for base was empty.")
      }
      console.log(this.base);
      this.base.style("width", this.width);
      this.base.style("height", this.height);
      this.base.style("background-color", "#555566")

      this.base.append('svg')
        .attr('oncontextmenu', 'return false;')
        .attr('width', this.width)
        .attr('height', this.height);
    }

    public render(data: ISocialPractice) {
      console.log("enter render()");
    }

  }
}
