import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import "./Finish.css";

class Finish extends PureComponent {
   static propTypes = {
      finish: PropTypes.arrayOf(
         PropTypes.shape({ type: PropTypes.oneOf(["rect"]) })
      ).isRequired
   };
   render() {
      const { finish } = this.props;
      return (
         <g className="Finish">
            {finish.map((finishPoint, i) => {
               const { type, ...props } = finishPoint;
               props.key = i;
               return React.createElement(type, props);
            })}
         </g>
      );
   }
}

export default Finish;
