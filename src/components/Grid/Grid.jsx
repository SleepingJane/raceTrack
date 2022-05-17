import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class Grid extends PureComponent {
   static propTypes = {
      size_x: PropTypes.number,
      size_y: PropTypes.number
   };
   render() {
      const { size_x, size_y } = this.props;
      const vertical = ` l 0 ${size_y} m 1 -${size_y}`.repeat(size_x + 1);
      const horizontal = ` l ${size_x} 0 m -${size_x} 1`.repeat(size_y + 1);
      return (
         <g className="Grid">
            <path d={"M 0 0 " + vertical + "M 0 0" + horizontal} />
         </g>
      );
   }
}

export default Grid;
