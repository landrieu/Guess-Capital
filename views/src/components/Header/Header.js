import React, { Component } from 'react'
import './Header.css';

export default class Header extends Component {
  componentDidMount(){
    console.log(this.props);

  }

  capitalize = (str) => {
    var s = str[0].toUpperCase() + str.substring(1, str.length).toLowerCase();
    return s;
  }

  setClassName = (region) => {
    var className = "select-region " + region.toLowerCase() + " ";
    if(region === this.props.regionSelected){
      className += "region-selected";
    }
    return className;
  }

  selectRegion = (region) => {
    if(region === this.props.regionSelected){
      return;
    }

    this.props.sendRequest(this.props.sendCountryRequest, {apiPath: "/continents", param: region});
  }

  render() {
    return (
      //<!-- As a link -->
      <div className="select-regions">
        {this.props.regions.map((region, i) => {                       
        return (
          <div className={this.setClassName(region)} key={region} onClick={this.selectRegion.bind(this, region)}>
            <div className="region-name-container">
              <div className="region-name-inner">
                <p>{this.capitalize(region)}</p>
              </div>
            </div>
            <div className="select-country-image"></div>
          </div>
          ) 
        })}
      </div>
    )
  }
}
