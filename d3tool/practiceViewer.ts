/// <reference path="typings/d3/d3.d.ts" />
/// <reference path="typings/requirejs/require.d.ts"/>

/// <amd-dependency path="lib/require.js"/>

import d3 = require("d3");

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

  export class PracticeViewer {

    base: d3.Selection<any>

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
      console.log("enter render()");
    }

  }
}
