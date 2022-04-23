import React, { Component } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Company from "./Components/Company";
import University from "./Components/University";
import Navbar from "./Components/Navbar";
import Admin from "./Components/Admin";
import "./App.css";



class App extends Component {


  render() {
    return (
      <div className="App">
      <Navbar />
      <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/university" element={<University/>}/>
      <Route path="/company"element={<Company/>}/>
      <Route path="/admin"element={<Admin/>}/>
      </Routes>
      </div>
    );
  }
}

export default App;
