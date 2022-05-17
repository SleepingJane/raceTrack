import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class Trace extends PureComponent {
   static propTypes = {
      trace: PropTypes.arrayOf(
         PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
      ).isRequired
   };
   render() {
      const { trace } = this.props;
      return (
         <g className="Trace">
            <path d={"M" + trace.join("L")} />
            {trace.map((pos, i) => (
               <circle cx={pos[0]} cy={pos[1]} r="0.2" key={i} />
            ))}
         </g>
      );
   }
}

export default Trace;
