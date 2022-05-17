import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class NextPos extends PureComponent {
   static propTypes = {};

   render() {
      const { x, delta_x, y, delta_y } = this.props;
      const common = {
         r: 0.45
      };
      return (
         <g className="NextPos">
            <circle cx={x + delta_x + 1} cy={y + delta_y + 1} {...common} />
            <circle cx={x + delta_x + 0} cy={y + delta_y + 1} {...common} />
            <circle cx={x + delta_x - 1} cy={y + delta_y + 1} {...common} />
            <circle cx={x + delta_x + 1} cy={y + delta_y + 0} {...common} />
            <circle cx={x + delta_x + 0} cy={y + delta_y + 0} {...common} />
            <circle cx={x + delta_x - 1} cy={y + delta_y + 0} {...common} />
            <circle cx={x + delta_x + 1} cy={y + delta_y - 1} {...common} />
            <circle cx={x + delta_x + 0} cy={y + delta_y - 1} {...common} />
            <circle cx={x + delta_x - 1} cy={y + delta_y - 1} {...common} />
         </g>
      );
   }
}

export default NextPos;
