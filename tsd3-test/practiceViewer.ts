/// <reference path="typings/d3/d3.d.ts" />
/// <reference path="typings/requirejs/require.d.ts"/>
/// <reference path="typings/cif/PracticeManager.d.ts" />

/// <amd-dependency path="lib/require.js"/>
/// <amd-dependency path="practiceManager"/>

import d3 = require("d3");

import Node = d3.layout.force.Node;
import Link = d3.layout.force.Link;

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

  interface INode extends IStage, Node{
      id?: number;
  }


  interface ILink extends Link<INode>{
  }

  interface ILinkObject {
    source: INode;
    target: INode;
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

    width = 960;
    height = 500;
    svg: d3.Selection<any>;
    nodes: INode[];
    links: ILink[];
    force: INode;

    constructor(baseDiv: HTMLDivElement, width?:number, height?:number) {
      //get the base SVG
      this.base = d3.select(baseDiv);
      if(this.base.empty()) {
        console.log("Selection for base was empty.");
      }

      this.base.style("width", (width)?width:this.width);
      this.base.style("height", (height)?height:this.height);
      this.base.style("background-color", "#555566");

      this.svg = this.base.append("svg")
        .attr("oncontextmenu", "return false;")
        .attr("width", this.width)
        .attr("height", this.height);

      console.log("svg:");
      console.dir(this.svg);

      var practice = practiceManager.getPractices()[0];
      this.nodes = this.makeNodes(practice);
      this.links = this.makeLinks(this.nodes);

      //setup the force laout
      this.force = d3.layout.force()
        .nodes(this.nodes)
        .links(this.links)
        .size([this.width, this.height])
        .linkDistance(150)
        .charge(-500);
        //.on("tick", this.tick);

        this.force.start();
    };

    private makeNodes(practice: ISocialPractice):d3.layout.force.Node[] {
      var nodes:INode[] = [practice.entryStage];
      return nodes.concat(practice.stages);
    }

    private makeLinksObjects(nodes: INode[]):ILinkObject[] {
      //note: targets are strings, not INode
      var links: ILinkObject[] = [];
      for(var nodeIndex=0; nodeIndex < nodes.length; nodeIndex++) {
        var node = nodes[nodeIndex];
        for (var nextStageIndex = 0; nextStageIndex < node.nextStages.length; nextStageIndex++ ) {
          var nextStage = getStageByName(node.nextStages[nextStageIndex], nodes);
          var link:ILinkObject = {source: node, target: nextStage};
          links.push(link);
        }
      }
      return links;
    }

    private makeLinks(nodes: INode[]):ILink[] {
      //note: targets are strings, not INode
      var links: ILink[] = [];
      for(var nodeIndex=0; nodeIndex < nodes.length; nodeIndex++) {
        var node = nodes[nodeIndex];
        for (var nextStageIndex = 0; nextStageIndex < node.nextStages.length; nextStageIndex++ ) {
          var nextStage = getStageByName(node.nextStages[nextStageIndex], nodes);

          //find the index of the next stage WRT the nodes:INode[]
          for(var nextStageNodesIndex = 0; nextStageNodesIndex < nodes.length; nextStageNodesIndex++) {
            if(nextStage === nodes[nextStageNodesIndex]) {
              var link:ILink = {source: nodeIndex, target: nextStageNodesIndex};
              links.push(link);
              break;
            }
          }
        }
      }
      return links;
    }

  };

/*******************************************************************************
 * Old practice viewer. Largely copy and paste from the logic encoding example.
 ******************************************************************************/
  export class PracticeViewerOld {

    base: d3.Selection<any>;
    circle: d3.Selection<any>;
    path: d3.Selection<any>;
    svg: d3.Selection<any>;
    selected_link: any;
    mousedown_link: any;
    mousedown_node: any;
    width = 960;
    height = 500;
    colors = d3.scale.category10();
    force: d3.layout.Force<d3.layout.force.Link<d3.layout.force.Node>, d3.layout.force.Node>;//<d3.layout.force.Node, d3.layout.force.Link>;
    nodes: INode[];
    links: ILink[];
    dragLine;


    constructor(elementID: HTMLDivElement) {

      //get the base SVG
      this.base = d3.select(elementID);
      if(this.base.empty()) {
        console.log("Selection for base was empty.");
      }

      this.base.style("width", this.width);
      this.base.style("height", this.height);
      this.base.style("background-color", "#555566");

      this.svg = this.base.append("svg")
        .attr("oncontextmenu", "return false;")
        .attr("width", this.width)
        .attr("height", this.height);

      console.log("svg:");
      console.dir(this.svg);

      var practice = practiceManager.getPractices()[0];
      this.nodes = this.makeNodes(practice);
      this.links = this.makeLinks(this.nodes);


      //setup the force laout

      this.force = d3.layout.force()
        .nodes(this.nodes)
        .links(this.links)
        .size([this.width, this.height])
        .linkDistance(150)
        .charge(-500)
        .on("tick", this.tick);

      // define arrow markers for graph links~
      this.svg.append("svg:defs").append("svg:marker")
        .attr("id", "end-arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 6)
        .attr("markerWidth", 3)
        .attr("markerHeight", 3)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#000");

      this.svg.append("svg:defs").append("svg:marker")
        .attr("id", "start-arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 4)
        .attr("markerWidth", 3)
        .attr("markerHeight", 3)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M10,-5L0,0L10,5")
        .attr("fill", "#000");


      // line displayed when dragging new nodes
      this.dragLine = this.svg.append("svg:path")
        .attr("class", "link dragline hidden")
        .attr("d", "M0,0L0,0");

      // handles to link and node element groups
      this.path = this.svg.append("svg:g").selectAll("path");
      this.circle = this.svg.append("svg:g").selectAll("g");


      this.restart(practiceManager.getPractices()[0]);
    }

    public restart(practice: ISocialPractice) {
      console.log("enter restart()");
      var pathDataUpdate:d3.selection.Update<any> = this.path.data(this.links);

      // update existing links
      pathDataUpdate.classed("selected", function(d) { return d === this.selected_link; })
        .style("marker-start", function(d) { return d.left ? "url(#start-arrow)" : ""; })
        .style("marker-end", function(d) { return d.right ? "url(#end-arrow)" : ""; });

      // add new links
      pathDataUpdate.enter().append("svg:path")
        .attr("class", "link")
        .classed("selected", function(d) { return d === this.selected_link; })
        .style("marker-start", function(d) { return d.left ? "url(#start-arrow)" : ""; })
        .style("marker-end", function(d) { return d.right ? "url(#end-arrow)" : ""; })
        .on("mousedown", function(d) {
          console.log("event mousedown handler for a link");
          if(d3.event.ctrlKey) {
            return;
          }

          // select link
          this.mousedown_link = d;
          if(this.mousedown_link === this.selected_link) {
            this.selected_link = null;
          } else {
            this.selected_link = this.mousedown_link;
          }
          this.selected_node = null;
          this.restart();
        });

        //remove old links
        pathDataUpdate.exit().remove();

        //circle (node) group
        //note: the function arg is crucial here! nodes are known by id, not by index!
        var circleUpdateData:d3.selection.Update<any> = this.circle.data<INode>(this.nodes);//, function(d) {return d.id; });

        //updating existing nodes (reflexive & and selectived visual states)
        circleUpdateData.selectAll("circle")
          .style("fill", function(d) {return (d===this.selected_node) ? d3.rgb((d.id).toString()).brighter().toString() : d3.rgb(d.id).toString();})
          .classed("reflexive", function(d){return d.reflexive;});

        //add new nodes
        var g = circleUpdateData.enter().append("svg:g");

        g.append("svg:circle")
          .attr("class", "node")
          .attr("r", 12)
          .style("fill", function(d){ return (d === this.selected_node) ?  d3.rgb((d.id).toString()).brighter().toString() : d3.rgb(d.id).toString();})
          .style("stroke", function(d) { return "#888888"; })//d3.rgb((d.id).toString()).darker().toString();})
          .classed("reflexive", function(d) { return d.reflexive; })
          .on("mouseover", function(d) {
            if(!this.mousedown_node || d === this.mousedown_node){ return ;};
            //enlarge target node
            d3.select(this).attr("transform", "scale(1.1)");
          })
          .on("mouseout", function(d) {
            if(!this.mousedown_node || d === this.mousedown_node) { return; };
            //unenlarge target node
          })
          .on("mouseup", function(d) {
            if(d3.event.ctrlKey) { return; };
            //select node
            this.mousedown_node = d;
            if(this.mousedown_node === this.selected_node) {
              this.selected_node = null;
            } else {
              this.selected_node = this.mousedown_node;
            }
            this.selected_link = null;
          //d3.drag_line()
            this.restart();
          });
    }

    // update force layout (called automatically each iteration)
    private tick() {
      // draw directed edges with proper padding from node centers
      this.path.attr("d", function(d) {
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
        return "M" + sourceX + "," + sourceY + "L" + targetX + "," + targetY;
      });

      this.circle.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    }

    private makeNodes(practice: ISocialPractice):INode[] {
      var nodes:INode[] = [practice.entryStage];
      return nodes.concat(practice.stages);
    }

    private makeLinksObjects(nodes: INode[]):ILinkObject[] {
      //note: targets are strings, not INode
      var links: ILinkObject[] = [];
      for(var nodeIndex=0; nodeIndex < nodes.length; nodeIndex++) {
        var node = nodes[nodeIndex];
        for (var nextStageIndex = 0; nextStageIndex < node.nextStages.length; nextStageIndex++ ) {
          var nextStage = getStageByName(node.nextStages[nextStageIndex], nodes);
          var link:ILinkObject = {source: node, target: nextStage};
          links.push(link);
        }
      }
      return links;
    }

    private makeLinks(nodes: INode[]):ILink[] {
      //note: targets are strings, not INode
      var links: ILink[] = [];
      for(var nodeIndex=0; nodeIndex < nodes.length; nodeIndex++) {
        var node = nodes[nodeIndex];
        for (var nextStageIndex = 0; nextStageIndex < node.nextStages.length; nextStageIndex++ ) {
          var nextStage = getStageByName(node.nextStages[nextStageIndex], nodes);

          //find the index of the next stage WRT the nodes:INode[]
          for(var nextStageNodesIndex = 0; nextStageNodesIndex < nodes.length; nextStageNodesIndex++) {
            if(nextStage === nodes[nextStageNodesIndex]) {
              var link:ILink = {source: nodeIndex, target: nextStageNodesIndex};
              links.push(link);
              break;
            }
          }
        }
      }
      return links;
    }

  }
}
