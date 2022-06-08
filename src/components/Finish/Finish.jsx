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
            <path d={`M0 ${finish[0].y} l${finish[0].width} 0`} className={"StartLine"} key={finish[0].y} />
            <path d={`M0 ${finish[0].y + 1} l${finish[0].width} 0`} className={"FinishLine"} key={finish[0].y + 1} />
         </g>
      );
   }
}

export default Finish;
