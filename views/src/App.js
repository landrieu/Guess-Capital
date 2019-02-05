import React, { Component } from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';

//Components
import Parameters from './components/services/Parameters'
import Header from './components/Header/Header'
import Play from './components/Play/Play'
//Others
import logo from './logo.svg';
import './App.css';

const ContinentType = "continent";
const CountryType = "country"

class App extends Component {

  state = {
    countries: [],
    countryRequested: {},
    regions: ["africa", "americas", "asia", "europe", "oceania"],
    pendingRequest: false,
    regionSelected: "Asia",
    randomCountries: []
  } 

  componentDidMount(){
    this.sendRequest(this.sendCountryRequest, {apiPath: "/countries"});
  }
 
  /*searchContinent = (continent) => {
    axios.get(Parameters.API_PATH + 'api/continent/' + continent)
      .then(res => {
        this.setState({countries: res.data});
        console.log(res);
      });
  }*/
  setRequestParameters = (data) => {
    if(data.requestParameters.type === ContinentType){
      this.setState({regionSelected: data.requestParameters.value});
    }

    this.setState({pendingRequest: false});
  }

  sendCountryRequest = (request) => {
    let url = Parameters.API_PATH + 'api';
    url += request.apiPath || "";
    url += request.param ? "/" + request.param : "";

    axios.get(url)
      .then(res => {
        this.setState({countries: res.data.results});
        this.setRequestParameters(res.data);
      });
  }

  sendRequest = (funcRequest, attributes, callback) => {
    if(this.state.pendingRequest){
      console.warn("Cannot send another request pending ...");
      if(callback) callback(false);
    }else{
      this.setState({pendingRequest: true});
      funcRequest(attributes)
    }
  }

  searchCountry = () => {
    var countryCode = document.getElementById('country').value;
    var countriesStored = this.state.countries;
    var countrySearched = {};

    for(let i = 0; i < countriesStored.length; i++){
      if(countriesStored[i].alpha2Code === countryCode){
        countrySearched = countriesStored[i];
        break;
      }
    }
    this.setState({countryRequested: countrySearched});
    /*axios.get(Parameters.API_PATH + 'api/countries/country/' + countryCode)
      .then(res => {
        if(res.data.found){
          this.setState({countryRequested: res.data.countries});
        }
    });*/
  }

  addPopulation(){
    var countryCode = document.getElementById('country').value;
    if(!countryCode) return
    axios.post(Parameters.API_PATH + 'api/countries/addPeople/' + countryCode)
      .then(res => {
          console.log(res);
    });
  }

  isCountryRequester = () => {
    return this.state.countryRequested.flag !== undefined;
  }

  selectRegion = (region) => {
    this.sendRequest(this.sendCountryRequest, {apiPath: "/countries/continent", param: region}, (success) => {
      if(success){
        this.setState({regionSelected: region});
      }
    });
  }

  
  setClassName = (region) => {
    var className = "select-region " + region.toLowerCase() + " ";
    if(region === this.state.regionSelected){
      className += "region-selected";
    }
    return className;
  }

  pickRandomCountries = () => {
    let nbCountries = 10;
    var randomNumber;
    var randomCountries = [];
    var countriesCopy = cloneDeep(this.state.countries);

    if(countriesCopy.length < nbCountries){
      randomCountries = countriesCopy;
    }else{
      for(let i = 0; i < nbCountries; i++){
        randomNumber = Math.floor(Math.random() * countriesCopy.length);
        randomCountries.push(countriesCopy[randomNumber]);
        countriesCopy.splice(randomNumber, 1);
      }
    }

    this.setState({randomCountries: randomCountries});
  }

  capitalize = (str) => {
    var s = str[0].toUpperCase() + str.substring(1, str.length).toLowerCase();
    return s;
  }

   renderCountry() {
    if(this.state.countryRequested.flag) {
      return (
        <div className="country-info">
          <div className="country-container">
            <img src={this.state.countryRequested.flag} alt="country" height="100" />
            <p>Name: <b>{this.state.countryRequested.name}</b><br></br>
            Population: <b>{this.state.countryRequested.population}</b><br></br>
            Region: <b>{this.state.countryRequested.region}</b><br></br>
            Subregion: <b>{this.state.countryRequested.subregion}</b><br></br>
            Capital: <b>{this.state.countryRequested.capital}</b></p>
          </div>
        </div>
      );
    } 
  }

  renderLoadingLogo(){
    if(this.state.pendingRequest){                       
      return (
        <img src={logo} className="App-logo" alt="logo" />
        ) 
    }
  }  

  //<Header />

  render() {
    return (
      <Router>
        <div className="App">
            <div className="body">
            <Route exact path="/" render={props => (
              <React.Fragment>
              <div className="select-regions">
                {this.state.regions.map((region, i) => {                       
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
              {this.renderLoadingLogo()}
              <div className="form-country">
                <input id="country" type="text" />
                <button type="button" className="btn btn-primary" onClick={this.searchCountry}>Search</button>
                <button type="button" className="btn btn-secondary" onClick={this.addPopulation}>Add Pop</button>
              </div>
              <div className="section-button-play">
                <Link to="/play" onClick={this.pickRandomCountries}>
                  <button type="button" className="btn btn-primary">Play</button>
                </Link>
              </div>
              {this.renderCountry()}
              </React.Fragment>  
            )}/>
            <Route exact path="/play" render={props => (
              <React.Fragment>
                <Play countries={this.state.randomCountries} continentCountries={this.state.countries}/>
              </React.Fragment>
            )}/>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
