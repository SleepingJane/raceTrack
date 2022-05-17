import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class CurrentPos extends PureComponent {
   static propTypes = {};
   render() {
      const { x, y } = this.props;
      return (
         <g className="CurrentPos">
            <circle cx={x} cy={y} r={0.5} />
         </g>
      );
   }
}

export default CurrentPos;
