import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import './Walls.css'

class Walls extends PureComponent {
   static propTypes = {
      walls: PropTypes.arrayOf(
         PropTypes.shape({ type: PropTypes.oneOf(["rect"]) })
      ).isRequired
   };
   render() {
      const { walls } = this.props;
      return (
         <g className="Walls">
            {walls.map((wall, i) => {
               const { type, ...props } = wall;
               props.key = i;
               return React.createElement(type, props);
            })}
         </g>
      );
   }
}

export default Walls;
