import React, { Component } from "react";
import "./App.css";
import Game from "./components/Game/Game";

export const walls = [
   {
      type: "rect",
      x: 3,
      y: 3,
      height: 2,
      width: 5
   }
];

export const finish = [
   {
      type: "rect",
      x: 0,
      y: 4,
      height: 1,
      width: 3
   }
];

class App extends Component {
   render() {
      const gameProps = {
         size_x: 11,
         size_y: 8,
         initial_x: 2,
         initial_y: 4,
         W: 3
      };
      return (
         <div className="App">
            <Game {...gameProps} />;
         </div>
      );
   }
}

export default App;
