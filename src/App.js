import React, { Component } from "react";
import "./App.css";
import Game from "./components/Game/Game";

class App extends Component {
   render() {
      const gameProps = {
         size_x: 50,
         size_y: 50,
         initial_x: 5,
         initial_y: 10
      };
      return (
         <div className="App">
            <Game {...gameProps} />;
         </div>
      );
   }
}

export default App;
