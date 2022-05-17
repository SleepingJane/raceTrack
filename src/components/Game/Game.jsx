import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Grid from "../Grid/Grid";
import CurrentPos from "../CurrentPos/CurrentPos";
import NextPos from "../NextPos/NextPos";

import "./Game.css";
import Trace from "../Trace/Trace";
import StopLine from "../StopLine/StopLine";
import Walls from "../Walls/Walls";
import { intersect } from "../../utils/intersect";
import Finish from "../Finish/Finish";

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
      y: 10,
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
         finish: finish
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
            <svg
               className="Game"
               viewBox={`-2 -2 ${size_x + 4} ${size_y + 4}`}
               onClick={this.handleClick}
               ref={ref => {
                  this.svg = ref;
               }}>
               <Grid size_x={size_x} size_y={size_y} />
               <Walls walls={walls} />
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
