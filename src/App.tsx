import React, { Component } from "react";
import "./App.css";
import Game from "./components/Game/Game";

class App extends Component {
   render() {
      const gameProps = {
         size_x: 11,
         size_y: 8,
         initial_x: 2,
         initial_y: 4
      };
      return (
         <div className="App">
            <Game {...gameProps} />;
         </div>
      );
   }
}

export default App;
