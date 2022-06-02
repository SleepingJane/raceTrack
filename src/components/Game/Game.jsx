import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Grid from "../Grid/Grid";
import CurrentPos from "../CurrentPos/CurrentPos";
import NextPos from "../NextPos/NextPos";

import "./Game.css";
import Trace from "../Trace/Trace";
import Walls from "../Walls/Walls";
import {intersect} from "../../utils/intersect";
import Finish from "../Finish/Finish";
import Corner from "../Corner/Corner";

import {Solver} from "../../logic/Game";
import {PointState} from "../../logic/PointState";

const walls = [
   {
      type: "rect",
      x: 3,
      y: 3,
      height: 2,
      width: 5
   }
];

const finish = [
   {
      type: "rect",
      x: 0,
      y: 4,
      height: 1,
      width: 3
   }
];

class Game extends PureComponent {
   static propTypes = {
      size_x: PropTypes.number.isRequired,
      size_y: PropTypes.number.isRequired,
      initial_x: PropTypes.number.isRequired,
      initial_y: PropTypes.number.isRequired
   };

   constructor(props) {
      super(props);
      this.state = {
         x: props.initial_x,
         y: props.initial_y,
         delta_x: 0,
         delta_y: 0,
         trace: [[props.initial_x, props.initial_y]],
         walls: walls,
         finish: finish,
         trackMap: props.trackMap,
         corners: [],
         currentSolution: [],
         currentSolutionIndex: 0
      };
   }

   intersectWall(x, y) {
      return x >= walls[0].x && x <= walls[0].x + walls[0].width && y >= walls[0].y && y <= walls[0].y + walls[0].height;
   }

   isValidNextPos(x, y) {
      const s = this.state;
      const isFinish = s.finish.some(finishPoint => intersect(finishPoint, [[s.x, s.y], [x, y]]));
      const isWall = this.intersectWall(x, y);
      const isWin = s.y > s.finish[0].y + 1 && y <= s.finish[0].y + 1;
      if (x > s.x + s.delta_x + 1 || x < s.x + s.delta_x - 1) return false;
      if (y > s.y + s.delta_y + 1 || y < s.y + s.delta_y - 1) return false;
      if (isWall || isFinish) {
         return false;
      }
      if (isWin) {
         alert('You win!');
         this.reloadGame();
      }
      return true; // TODO; check walls
   }

   getRectanglesSize(W = 3) {
      const rect1A = Math.floor(Math.sqrt(2*W));
      const rect1B = Math.floor(Math.sqrt(2*W)) + 1;
      const rect2A = Math.floor(Math.sqrt(2*W));
      const rect2B = W;
      return {A: {width: rect1A, height: rect1B},
         B: {width: rect2A, height: rect2B}};
   }

   getPointsUnionOfRects(startPoint = {x: 3, y: 0}, A, B, directionHor = 'l', directionVer = 'b') {
      const result = [];
      const direction = directionHor + directionVer;

      switch (direction) {
         case 'lb':
            // левый верхний прямоугольник
            for (let i = startPoint.x - A.width; i < startPoint.x; i++) {
               for (let j = startPoint.y; j < startPoint.y + A.height + B.height; j++) {
                  result.push({x: i, y: j});
               }
            }
            break;
         case 'rt':
            // правый нижний прямоуольник
            for (let i = startPoint.x; i < startPoint.x + A.width; i++) {
               for (let j = startPoint.y; j > startPoint.y - A.height - B.height; j--) {
                  result.push({x: i, y: j});
               }
            }
            break;
         case 'll':
            // правый верхний
            for (let i = startPoint.x; i > startPoint.x - A.height - B.height; i--) {
               for (let j = startPoint.y; j > startPoint.y - A.width; j--) {
                  result.push({x: i, y: j});
               }
            }
            break;
         case 'rb':
            // левый нижний
            for (let i = startPoint.x; i < startPoint.x + A.height + B.height; i++) {
               for (let j = startPoint.y; j < startPoint.y + A.width; j++) {
                  result.push({x: i, y: j});
               }
            }
            break;
      }

      return result;
   }

   solutionView(solution) {
      if (!solution) {
         return;
      }

      let res = [];
      res.push(solution);

      let parent = solution.parent;
      while (parent) {
         res.push(parent);
         parent = parent.parent;
      }

      res = res.reverse();

      for (let i = 0; i < res.length; i++) {
         this.setState(s => {
            return {
               trace: [...s.trace, [res[i].x, res[i].y]],
               x: res[i].x,
               y: res[i].y,
               delta_x: res[i].x - s.x,
               delta_y: res[i].y - s.y
            };
         });
      }
   }

   startSolve = event => {
      // Получение размеров прямоугольников
      const rects = this.getRectanglesSize();
      const rectA = rects.A;
      const rectB = rects.B;

      const leftTopRegion = this.getPointsUnionOfRects({x: 3, y: 0}, rectA, rectB, 'l', 'b');
      const rightTopRegion = this.getPointsUnionOfRects({x: 8, y: 4}, rectA, rectB, 'l', 'l');
      const leftBottomRegion = this.getPointsUnionOfRects({x: 0, y: 18}, rectA, rectB, 'r', 'b');
      const rightBottomRegion = this.getPointsUnionOfRects({x: 25, y: 22}, rectA, rectB, 'r', 't');

      const cornerRegions = [
         ...leftTopRegion,
         ...rightTopRegion,
         ...leftBottomRegion,
         ...rightBottomRegion
      ]

      this.setState({corners: this.getCornersView(cornerRegions) || []});

      const solver = new Solver(2, 4, 0, 0, 2, 5);
      let solution = solver.graphState();

      /*
      let minLeftSol = solution;
      let minRightSol = null;
      let min3 = null;
      let min4 = null;
      outer: while (!min4) {
         for (let i = 0; i < leftTopRegion.length; i++) {
            const res1 = new Solver(2, 15, 0, 0, leftTopRegion[i].x, leftTopRegion[i].y).bfs();
            if (res1) {
               minLeftSol = res1;
               for (let j = 0; j < rightTopRegion.length; j++) {
                  const res2 = new Solver(res1.x, res1.y, res1.delta_x, res1.delta_y, rightTopRegion[j].x, rightTopRegion[j].y).bfs();
                  if (res2) {
                     minRightSol = res2;
                     for (let k = 0; k < rightBottomRegion.length; k++) {
                        const res3 = new Solver(res2.x, res2.y, res2.delta_x, res2.delta_y, rightBottomRegion[k].x, rightBottomRegion[k].y).bfs();
                        if (res3) {
                           min3 = res3;
                           for (let m = 0; m < leftBottomRegion.length; m++) {
                              const res4 = new Solver(res3.x, res3.y, res3.delta_x, res3.delta_y,
                                 leftBottomRegion[m].x, leftBottomRegion[m].y).bfs();
                              if (res4) {
                                 min4 = res4;
                                 break outer;
                              }
                           }
                        }
                     }
                  }
               }
            }
         }
         break outer;
      }

      this.solutionView(minLeftSol);
      this.solutionView(minRightSol);
      this.solutionView(min3);
      this.solutionView(min4);*/
      if (solution.length) {
         this.setState({
            currentSolutionIndex: 0,
            currentSolution: solution
         });

         this.solutionView(solution[0]);
      }
   }

   getMinSolutionPath(solution) {
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

   getCornersView(points) {
      return points.map(point => {
         return {
            type: "rect",
            x: point.x,
            y: point.y,
            height: 1,
            width: 1
         }
      })
   }

   updatePos = (x, y) => {
      this.setState(s => {
         if (!this.isValidNextPos(x, y)) return {};
         return {
            trace: [...s.trace, [x, y]],
            x,
            y,
            delta_x: x - s.x,
            delta_y: y - s.y
         };
      });
   };

   solutionChange = event => {
      this.reloadGame();
      this.solutionView(this.state.currentSolution[this.state.currentSolutionIndex + 1]);

      this.setState(s => {
         return { currentSolutionIndex: s.currentSolutionIndex + 1 }
      });
   }

   optimalSolutionView = event => {
      this.reloadGame();
      const solution = this.getMinSolutionPath(this.state.currentSolution);

      if (solution) {
         this.solutionView(solution);
      }
   }

   reloadGame = event => {
      this.setState({
         x: this.props.initial_x,
         y: this.props.initial_y,
         delta_x: 0,
         delta_y: 0,
         trace: [[this.props.initial_x, this.props.initial_y]],
         walls: walls,
         finish: finish
      });
   }

   handleClick = event => {
      const pt = this.svg.createSVGPoint();
      pt.x = event.clientX;
      pt.y = event.clientY;
      const cursopt = pt.matrixTransform(this.svg.getScreenCTM().inverse());

      this.updatePos(Math.round(cursopt.x), Math.round(cursopt.y));
   };

   goBack = event => {
      if (this.state.trace.length < 2) return;
      this.setState(s => {
         const newTrace = s.trace.slice(0, -1);
         const pos = newTrace[newTrace.length - 1];
         let delta = [0, 0];
         if (newTrace.length > 1) {
            const lastpos = newTrace[newTrace.length - 2];
            delta = [pos[0] - lastpos[0], pos[1] - lastpos[1]];
         }
         return {
            trace: newTrace,
            x: pos[0],
            y: pos[1],
            delta_x: delta[0],
            delta_y: delta[1]
         };
      });
   };

   render() {
      const { size_x, size_y } = this.props;
      return (
         <div className="Game">
            <h1>RaceTrack, path length:{this.state.trace.length}</h1>
            <button onClick={this.goBack}>Undo</button>
            <button className="reloadBtn" onClick={this.reloadGame}>New game</button>
            <button className="reloadBtn" onClick={this.startSolve}>Check</button>
            <button className="reloadBtn" onClick={this.solutionChange}>Next solution</button>
            <button className="reloadBtn" onClick={this.optimalSolutionView}>View optimal solution</button>
            <svg
               className="Game"
               viewBox={`-2 -2 ${size_x + 4} ${size_y + 4}`}
               onClick={this.handleClick}
               ref={ref => {
                  this.svg = ref;
               }}>
               <Grid size_x={size_x} size_y={size_y} />
               <Walls walls={walls} />
               <Corner corners={this.state.corners} />
               <Finish finish={finish} />
               <Trace trace={this.state.trace} />
               <CurrentPos {...this.state} />
               <NextPos {...this.state} />
            </svg>
         </div>
      );
   }
}

export default Game;
