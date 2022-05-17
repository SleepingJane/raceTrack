import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class StopLine extends PureComponent {
   static propTypes = {
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      delta_x: PropTypes.number.isRequired,
      delta_y: PropTypes.number.isRequired,
      size_x: PropTypes.number.isRequired,
      size_y: PropTypes.number.isRequired
   };
   _sum(p) {
      const sign = Math.sign(p);
      p = Math.abs(p);
      let s = 0;
      while (p > 0) {
         s += p;
         p--;
      }
      return s * sign;
   }
   getStops(p, delta_p) {
      return [
         p + this._sum(delta_p - 1),
         p + this._sum(delta_p),
         p + this._sum(delta_p + 1)
      ];
   }
   render() {
      const { x, y, delta_x, delta_y, size_x, size_y } = this.props;
      //if (delta_x < 4 && delta_y < 4) return null;
      let x_limit, y_limit;
      if (Math.abs(delta_x) > 2) {
         x_limit = this.getStops(x, delta_x).map((s, i) => (
            <path d={`M${s} 0 l0 ${size_x}`} className={"stop" + i} key={i} />
         ));
      }
      if (Math.abs(delta_y) > 2) {
         y_limit = this.getStops(y, delta_y).map((s, i) => (
            <path d={`M0 ${s} l${size_y} 0`} className={"stop" + i} key={i} />
         ));
      }
      return (
         <g className="StopLine">
            {x_limit}
            {y_limit}
         </g>
      );
   }
}

export default StopLine;
