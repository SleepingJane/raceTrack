import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Grid from "../Grid/Grid";
import CurrentPos from "../CurrentPos/CurrentPos";
import NextPos from "../NextPos/NextPos";

import "./Game.css";
import Trace from "../Trace/Trace";
import StopLine from "../StopLine/StopLine";
import Walls from "../Walls/Walls";
import {intersect} from "../../utils/intersect";
import Finish from "../Finish/Finish";
import Corner from "../Corner/Corner";
import {PointState} from "../../logic/PointState";

import {Solver} from "../../logic/Game";

const walls = [
   {
      type: "rect",
      x: 10,
      y: 10,
      height: 30,
      width: 30
   }
];

const finish = [
   {
      type: "rect",
      x: 0,
      y: 20,
      height: 1,
      width: 10
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
         corners: []
      };
   }

   isValidNextPos(x, y) {
      const s = this.state;
      const isFinish = s.finish.some(finishPoint => intersect(finishPoint, [[s.x, s.y], [x, y]]));
      const isWall = s.walls.some(wall => intersect(wall, [[s.x, s.y], [x, y]]));
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

   getRectanglesSize(W = 10) {
      const rect1A = Math.floor(Math.sqrt(2*W));
      const rect1B = Math.floor(Math.sqrt(2*W)) + 1;
      const rect2A = Math.floor(Math.sqrt(2*W));
      const rect2B = W;
      return {A: {width: rect1A, height: rect1B},
         B: {width: rect2A, height: rect2B}};
   }

   getPointsUnionOfRects(startPoint = {x: 10, y: 0}, A, B, directionHor = 'l', directionVer = 'b') {
      const result = [];

      // left bottom
      for (let i = startPoint.x - A.width; i < startPoint.x; i++) {
         for (let j = startPoint.y; j < startPoint.y + A.height + B.height; j++) {
            result.push({x: i, y: j});
         }
      }

      const solver = new Solver(5, 18, 0, 0, 45, 16);
      const solution = solver.solveDFS();

      return result;
   }

   getCorner = event => {
      const rects = this.getRectanglesSize();
      const rectA = rects.A;
      const rectB = rects.B;

      const res = this.getPointsUnionOfRects({x: 10, y: 0}, rectA, rectB);
      this.setState({corners: this.getCornersView(res) || []});
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
            <button className="reloadBtn" onClick={this.getCorner}>Check</button>
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
               <StopLine {...this.state} {...this.props} />
               <NextPos {...this.state} />
            </svg>
         </div>
      );
   }
}

export default Game;
