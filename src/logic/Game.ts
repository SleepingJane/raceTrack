import {PointState} from "./PointState";
import React from "react";
import {intersect} from "../utils/intersect";
import {finish, size_map, walls} from "../App";

export class Solver {
   constructor(start_x: number, start_y: number, speed_x: number, speed_y: number, goal_x?: number, goal_y?: number) {
      this.start_node = new PointState(start_x, start_y, speed_x, speed_y);
      this.goal_node = new PointState(goal_x || 0, goal_y || 0, 0, 0);
      this.bfs = this.bfs.bind(this);
      this.solveDFS = this.solveDFS.bind(this);
   }

   protected start_node: PointState;
   protected goal_node: PointState;

   protected queue: Array<PointState> = [];
   protected visited: any = [];

   protected stateGraph: Array<PointState> = [];


   public isEndGame(currentNode: PointState, goalNode: PointState): boolean {
      return currentNode.x === goalNode.x && currentNode.y === goalNode.y;
   }

   // получаем возможные позиции
   private getNeighbours(currentNode: PointState): Array<PointState> {
      const neighbours = [];
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x + 1, currentNode.y + currentNode.delta_y + 1, currentNode.delta_x + 1, currentNode.delta_y + 1));
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x + 0, currentNode.y + currentNode.delta_y + 1, currentNode.delta_x + 0, currentNode.delta_y + 1));
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x - 1, currentNode.y + currentNode.delta_y + 1, currentNode.delta_x - 1, currentNode.delta_y + 1));
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x + 1, currentNode.y + currentNode.delta_y + 0, currentNode.delta_x + 1, currentNode.delta_y + 0));
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x + 0, currentNode.y + currentNode.delta_y + 0, currentNode.delta_x + 0, currentNode.delta_y + 0));
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x - 1, currentNode.y + currentNode.delta_y + 0, currentNode.delta_x - 1, currentNode.delta_y + 0));
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x + 1, currentNode.y + currentNode.delta_y - 1, currentNode.delta_x + 1, currentNode.delta_y - 1));
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x + 0, currentNode.y + currentNode.delta_y - 1, currentNode.delta_x + 0, currentNode.delta_y - 1));
      neighbours.push(new PointState(currentNode.x + currentNode.delta_x - 1, currentNode.y + currentNode.delta_y - 1, currentNode.delta_x - 1, currentNode.delta_y - 1));

      neighbours.forEach((item: PointState) => {
         item.visited = this.isVisited(item);
      })
      return neighbours;
   }

   private isEqualNode(firstNode: PointState, secondNode: PointState): boolean {
      return firstNode.x === secondNode.x && firstNode.y === secondNode.y;
   }

   intersectWall(x: number, y: number) {
      let flag = false;
      walls.forEach((wall) => {
         if (x >= wall.x && x <= wall.x + wall.width && y >= wall.y && y <= wall.y + wall.height) {
            flag = true;
         }
      });
      return flag;
   }

   private isVisited(node: PointState): boolean {
      return this.visited.find((item: PointState) => this.isEqualNode(item, node));
   }

   private isValidMove(currentNode: PointState, nexNode: PointState): boolean {
      const isFinish = finish.some(finishPoint => intersect(finishPoint, [[currentNode.x, currentNode.y], [nexNode.x, nexNode.y]]));
      const isWall = this.intersectWall(nexNode.x, nexNode.y) || this.intersectWall(currentNode.x, currentNode.y);
      const isExternal = nexNode.x <= 0 || nexNode.y <= 0
         || nexNode.x >= size_map.size_x || nexNode.y >= size_map.size_y;
      if (nexNode.x === currentNode.x && nexNode.y === currentNode.y) return false;
      if (nexNode.x > currentNode.x + currentNode.delta_x + 1 || nexNode.x < currentNode.x + currentNode.delta_x - 1) return false;
      if (nexNode.y > currentNode.y + currentNode.delta_y + 1 || nexNode.y < currentNode.y + currentNode.delta_y - 1) return false;

      return !(isWall || isFinish || isExternal);
   }

   public solveDFS(): void {
      this.visited = [];
      let result = this.dfs(this.start_node);
      console.log(result);
   }

   private dfs(node: PointState): any {
      if (node.visited) {
         return;
      }
      this.visited.push(node);
      if (this.isEndGame(node, this.goal_node)) {
         alert('Found');
         return true;
      }
      const neighbours: PointState[] = this.getNeighbours(node);
      for (let i = 0; i < neighbours.length; i++) {
         neighbours[i].visited = true;
         const isValid = this.isValidMove(node, neighbours[i]);
         if (!isValid) {
            this.visited.push(neighbours[i]);
         } else {
            neighbours[i].parent = node;
            if (this.isEndGame(neighbours[i], this.goal_node)) {
               alert('Found');
               return neighbours[i];
            }
            this.dfs(neighbours[i]);
         }
      }

      return null;
   }

   public graphState(): any {
      this.queue = [];
      const start_node = this.start_node;
      const goal_node = this.goal_node;

      const start = new Date().getTime();
      let end = new Date().getTime();

      this.queue.push(start_node);
      const graph: PointState[] = [];

      while (this.queue.length !== 0) {
         end = new Date().getTime();
         let currentState: PointState = this.queue.shift() as PointState;
         if (end - start > 300000) {
            alert(`Time: ${end - start}`);
            this.stateGraph = graph;
            return graph;
         }
         if (this.isEndGame(currentState, goal_node)
            || this.isEndGame(currentState, new PointState(1, goal_node.y, 0, 0))) {
            console.log("You win!");
            console.log(currentState);
            graph.push(currentState);
         }

         const neighbours: PointState[] = this.getNeighbours(currentState);
         for (let i = 0; i < neighbours.length; i++) {
            if (this.isValidMove(currentState, neighbours[i])) {
               neighbours[i].parent = currentState;
               this.queue.push(neighbours[i]);
            }
         }
      }

      return graph;
   }

   public getMinSolutionPath(solution: PointState[]): any {
      if (!solution.length) {
         return null;
      }
      let min = solution[0];
      for (let i = 0; i < solution.length; i++) {
         if (solution[i].deep < min.deep) {
            min = solution[i];
         }
      }
      return min;
   }

   public bfs(): void | any {
      this.visited = [];
      this.queue = [];
      const start_node = this.start_node;
      const goal_node = this.goal_node;
      let count = 0;

      const start = new Date().getTime();
      let end = new Date().getTime();

      this.queue.push(start_node);
      this.visited.push(start_node);

      start_node.visited = true;

      while (this.queue.length !== 0) {
         end = new Date().getTime();
         let currentState: PointState = this.queue.shift() as PointState;
         if (this.isEndGame(currentState, goal_node)
            || this.isEndGame(currentState, new PointState(1, goal_node.y, 0, 0))) {
            console.log("You win!");
            console.log(currentState);
            return currentState;
         }

         const neighbours: PointState[] = this.getNeighbours(currentState);
         for (let i = 0; i < neighbours.length; i++) {
            if (!neighbours[i].visited) {
               if (this.isValidMove(currentState, neighbours[i])) {
                  neighbours[i].parent = currentState;
                  this.queue.push(neighbours[i]);
               }
               neighbours[i].visited = true;
               this.visited.push(neighbours[i]);
            }
         }
      }

      return null;
   }
}
