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
    nextStages: string[];
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

  function getPracticeByName(name: string):ISocialPractice {
    var practice : ISocialPractice;
    var practices : ISocialPractice[] = practiceManager.getPractices();
    for (var practiceIndex : number = 0; practiceIndex < practices.length; practiceIndex++) {
      if(name === practices[practiceIndex].label) {
        return practices[practiceIndex];
      }
    }
    return undefined;
  }

  function getStageByName(name: string, stages: IStage[]):IStage {
    for(var stageIndex=0; stageIndex < stages.length; stageIndex++) {
      var stage = stages[stageIndex];
      if(stage.label === name) {
        return stage;
      }
    }
    return undefined;
  }

  interface ILink {
    source: INode;
    target: INode;
  }

  interface INode extends IStage{
      index?: number;
      x?: number;
      y?: number;
      px?: number;
      py?: number;
      fixed?: boolean;
      weight?: number;
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

  export class PracticeViewer {

    base: d3.Selection<any>;
    circle: d3.Selection<any>;
    path: d3.Selection<any>;
    width = 960;
    height = 500;
    colors = d3.scale.category10();
    force: any;
    nodes: INode[];
    links: ILink[];

    constructor(elementID: HTMLDivElement) {

      //get the base SVG
      this.base = d3.select(elementID);
      if(this.base.empty()) {
        console.log("Selection for base was empty.")
      }

      this.base.style("width", this.width);
      this.base.style("height", this.height);
      this.base.style("background-color", "#555566")

      this.base.append('svg')
        .attr('oncontextmenu', 'return false;')
        .attr('width', this.width)
        .attr('height', this.height);


      var practice = practiceManager.getPractices()[0];
      this.nodes = this.makeNodes(practice);
      this.links = this.makeLinks(this.nodes);
      this.render(practiceManager.getPractices()[0]);

      //setup the force laout

      var force = d3.layout.force()
        .nodes(this.nodes)
        .links(this.links)
        .size([this.width, this.height])
        .linkDistance(150)
        .charge(-500)
        .on('tick', this.tick);

    }

    public render(data: ISocialPractice) {
      console.log("enter render()");
    }

    // update force layout (called automatically each iteration)
    private tick() {
      // draw directed edges with proper padding from node centers
      this.path.attr('d', function(d) {
        var deltaX = d.target.x - d.source.x,
            deltaY = d.target.y - d.source.y,
            dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
            normX = deltaX / dist,
            normY = deltaY / dist,
            sourcePadding = d.left ? 17 : 12,
            targetPadding = d.right ? 17 : 12,
            sourceX = d.source.x + (sourcePadding * normX),
            sourceY = d.source.y + (sourcePadding * normY),
            targetX = d.target.x - (targetPadding * normX),
            targetY = d.target.y - (targetPadding * normY);
        return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
      });

      this.circle.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    }

    private makeNodes(practice: ISocialPractice):INode[] {
      var nodes:INode[] = [practice.entryStage];
      return nodes.concat(practice.stages);
    }

    private makeLinks(nodes: INode[]):ILink[] {
      //note: targets are strings, not INode
      var links: ILink[] = [];
      for(var nodeIndex=0; nodeIndex < nodes.length; nodeIndex++) {
        var node = nodes[nodeIndex];
        for (var nextStageIndex = 0; nextStageIndex < node.nextStages.length; nextStageIndex++ ) {
          var nextStage = getStageByName(node.nextStages[nextStageIndex], nodes);
          var link:ILink = {source: node, target: nextStage}
          links.push(link);
        }
      }
      return links;
    }

  }
}
