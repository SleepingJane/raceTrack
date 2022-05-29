import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import './Corner.css'

class Corner extends PureComponent {
   static propTypes = {
      corners: PropTypes.arrayOf(
         PropTypes.shape({ type: PropTypes.oneOf(["rect"]) })
      ).isRequired
   };
   render() {
      const { corners } = this.props;
      return (
         <g className="Corner">
            {corners.map((corner, i) => {
               const { type, ...props } = corner;
               props.key = i;
               return React.createElement(type, props);
            })}
         </g>
      );
   }
}

export default Corner;
