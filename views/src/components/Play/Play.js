import React, { Component } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import './Play.css';

export default class Play extends Component {
    state = {
        step: 0,
        score: 0,
        challengeSteps: [],
        randomPropertiesCountries: [],
        currentSuggestions: null,
        quizzProperties: ["name", "capital", "population"]
    }

    componentDidMount(){
        this.pickRandomProperties();
        
        //this.initChallengeSteps();
    }

    mixCountriesProperties = (randomPropertiesCountries) => {
        /**
        * Randomize array element order in-place.
        * Using Durstenfeld shuffle algorithm.
        */
        var shuffleArray = function(array) {
           for (var i = array.length - 1; i > 0; i--) {
               var j = Math.floor(Math.random() * (i + 1));
               var temp = array[i];
               array[i] = array[j];
               array[j] = temp;
           }
           return array;
        }

        var properties = ["name", "capital", "population"];
        var tempShuffledArr = [];
        var tempShuffledObj = {};
        
        for(let i = 0; i < 10; i++){
            tempShuffledObj = {};
            properties.forEach((p) => {
                tempShuffledObj[p] = shuffleArray(randomPropertiesCountries[i][p]);
            });
            tempShuffledArr.push(tempShuffledObj);
        }

        this.setState({randomPropertiesCountries: tempShuffledArr},() => {
            console.log(this.state.randomPropertiesCountries);
            this.setCurrentSuggestions();
        });
    }

    pickRandomProperties = () => {
        
        var randomProp = [];
        var pickRandomProp = (idx) => {
            var continentCountries = cloneDeep(this.props.continentCountries);
            var tempProp = {};
            var tempArr, randomNumber;
            var properties = ["name", "capital", "population"];

            properties.forEach((prop) => {
                tempArr = [];
                for(let i = 0; i < 3; i++){
                    randomNumber = Math.floor(Math.random() * continentCountries.length);
                    tempArr.push(continentCountries[randomNumber][prop]);
                    continentCountries.splice(randomNumber, 1);
                }
                tempArr.splice( Math.floor(Math.random()*3), 0, this.props.countries[idx][prop]);
                tempProp[prop] = tempArr;
            });
            return tempProp;
        };
        
        for(let i = 0; i < 10; i++){
            randomProp.push(pickRandomProp(i));
        }


        this.mixCountriesProperties(randomProp);
    }

    setStep = (increment) => {
        if(!increment && this.state.step < 1)  return;
        if(increment && this.state.step > 8) return;
        let newStep = increment ? this.state.step + 1 : this.state.step - 1;
        this.setState({step: newStep});
        this.setCurrentSuggestions(newStep);
    }

    getStep = () => {
        return this.state.step;
    }

    getCountryProperty = (prop) => {
        return this.props.countries[this.getStep()][prop];
    }

    setCurrentSuggestions = (step) => {
        console.log(s + " " + this.state.step);
        let s =  step || this.state.step;
        this.setState({currentSuggestions: this.state.randomPropertiesCountries[s]});
    }
    getCurrentProperties = (prop) => {
        if(!(this.state.randomPropertiesCountries.length > 0)){
            return null;
        }
        console.log(prop);
        return this.state.randomPropertiesCountries[this.getStep()][prop];
    }

    renderRandomProp(prop){
        if(this.state.currentSuggestions){
            return(
            this.state.currentSuggestions[prop].map((p, i) => {
                return(
                    <div key={p+i}>{p}</div>
                )
            })
            )
        }
    }

    render() {
        return (
            <div>

                <p>Here</p>
                <div>
                    <div>
                        <div className="country-info">
                            <div className="country-container">
                                <img src={this.props.countries[this.getStep()].flag} alt="country" height="100" />
                                <p>Name: <b>{this.props.countries[this.state.step].name}</b><br></br>
                                Population: <b>{this.props.countries[this.state.step].population}</b><br></br>
                                Region: <b>{this.props.countries[this.state.step].region}</b><br></br>
                                Subregion: <b>{this.props.countries[this.state.step].subregion}</b><br></br>
                                Capital: <b>{this.props.countries[this.state.step].capital}</b></p>
                            </div>
                        </div>
                    </div>
                    <div className="quizz-info">
                    {this.state.quizzProperties.map((prop) => {                       
                        return (
                        <div className="" key={prop} >
                            <div className="quizz-prop-container">
                                <div className="quizz-prop-inner">
                                    {this.renderRandomProp(prop)}
                                </div>
                            </div>
                        </div>
                        ) 
                    })}
                    </div>
                </div>
                <div className="section-play-buttons">
                    <button type="button" className={(this.state.step !== 0) ? "btn btn-primary" : "btn btn-secondary"} onClick={this.setStep.bind(this, false)}>Previous</button>
                    <button type="button" className={(this.state.step !== 9) ? "btn btn-primary" : "btn btn-secondary"} onClick={this.setStep.bind(this, true)}>Next</button>
                </div>
            </div>
        )
    }
}
/**
 * 
 */