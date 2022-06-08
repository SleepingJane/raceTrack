import React, { Component } from "react";
import "./App.css";
import Game from "./components/Game/Game";
import {maps} from "./TrackSource";

export const walls = maps[1].walls;
export const finish = maps[1].finish;
export const size_map = maps[1].size_map;

class App extends Component {
   render() {
      const gameProps = {
         size_x: maps[1].size_map.size_x,
         size_y: maps[1].size_map.size_y,
         initial_x: maps[1].size_map.initial_x,
         initial_y: maps[1].size_map.initial_y,
         W: maps[1].size_map.W
      };
      return (
         <div className="App">
            <Game {...gameProps} />;
         </div>
      );
   }
}

export default App;
