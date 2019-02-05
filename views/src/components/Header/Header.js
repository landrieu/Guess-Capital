import React, { Component } from 'react'
import './Header.css';

export default class Header extends Component {
  render() {
    return (
      //<!-- As a link -->
      <nav className="navbar navbar-light">
        <a className="navbar-brand" href="#">Countries</a>
      </nav>
    )
  }
}
