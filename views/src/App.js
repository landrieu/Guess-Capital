import React, { Component } from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';

//Components
import Parameters from './components/services/Parameters';
import Header from './components/Header/Header';
import Play from './components/Play/Play';
//Others
import logo from './logo.svg';
import './App.css';

const ContinentType = "continent";
//const CountryType = "country";

class App extends Component {

  state = {
    countries: [],
    regions: ["africa", "americas", "asia", "europe", "oceania"],
    pendingRequest: false,
    regionSelected: "Asia",
    randomCountries: [],
    nbCountries: 2
  } 

  componentDidMount(){
    this.sendRequest(this.sendCountryRequest, {apiPath: "/countries"});
  }

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
        this.setState({countries: res.data.results/*, nbCountries: nbCountries*/});
        this.setRequestParameters(res.data);
      });
  }

  sendRequest = (funcRequest, attributes, callback) => {
    if(this.state.pendingRequest){
      console.warn("Cannot send another request pending ...");
      if(callback) callback(false);
    }else{
      this.setState({pendingRequest: true});
      funcRequest(attributes);
    }
    console.log(this.state);
  }

  pickRandomCountries = () => {
    let nbCountries = this.state.nbCountries;
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

  renderLoadingLogo(){
    if(this.state.pendingRequest){                       
      return (
        <img src={logo} className="App-logo" alt="logo" />
        ) 
    }
  }  

  render() {
    return (
      <Router>
        <div className="App">
            <div className="body">
            {/* Main route */}
            <Route exact path="/" render={props => (
              <React.Fragment>
              <Header 
                regions={this.state.regions} 
                regionSelected={this.state.regionSelected}
                sendRequest={this.sendRequest.bind(this)}
                sendCountryRequest={this.sendCountryRequest.bind(this)}
              />
              {this.renderLoadingLogo()}
              <div className="section-button-play">
                <Link to="/play" onClick={this.pickRandomCountries}>
                  <button type="button" className="btn btn-primary">Play</button>
                </Link>
              </div>
              </React.Fragment>  
            )}/>

            {/* Play route */}
            <Route exact path="/play" render={props => (
              <React.Fragment>
                <Play 
                countries={this.state.randomCountries} 
                continentCountries={this.state.countries}
                nbCountries={this.state.nbCountries}
                />
              </React.Fragment>
            )}/>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;

/*addPopulation(){
    var countryCode = document.getElementById('country').value;
    if(!countryCode) return
    axios.post(Parameters.API_PATH + 'api/countries/addPeople/' + countryCode)
      .then(res => {
          console.log(res);
    });
  }*/

  /*isCountryRequester = () => {
    return this.state.countryRequested.flag !== undefined;
  }*/

  /*selectRegion = (region) => {
    if(region === this.state.regionSelected){
      return;
    }

    this.sendRequest(this.sendCountryRequest, {apiPath: "/continents", param: region}, (success) => {
      if(success){
        this.setState({regionSelected: region});
      }
    });
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
    });
  }
  
  */

  /*searchContinent = (continent) => {
    axios.get(Parameters.API_PATH + 'api/continent/' + continent)
      .then(res => {
        this.setState({countries: res.data});
        console.log(res);
      });
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
  
  */

/*<div className="form-country">
<input id="country" type="text" />
<button type="button" className="btn btn-primary" onClick={this.searchCountry}>Search</button>
<button type="button" className="btn btn-secondary" onClick={this.addPopulation}>Add Pop</button>
</div>*/