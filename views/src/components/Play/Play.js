import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import Progress from './Progress/Progress';
import Answers from './Answers/Answers';
import Step from './Step/Step';
import './Play.css';

export default class Play extends Component {
    state = {
        step: 0,
        quizzAnswers: [],
        randomPropertiesCountries: [],
        quizzProperties: ["name", "capital"/*, "population", "alpha3Code"*/],
        currentAnswer: {},
        score: {
            goodAnswers: 0,
            nbAnswers: 0
        }
    }

    componentDidMount(){

       if(!this.props.countries || this.props.countries.length === 0){
            return;
       }

        this.pickRandomProperties();
        
        var n = this.props.nbCountries;
        var arr = []
        for (var i = 0; i < n; i++){
            arr.push({});
        }
        this.setState({quizzAnswers: arr});
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

        var tempShuffledArr = [];
        var tempShuffledObj = {};
        
        for(let i = 0; i < this.props.nbCountries; i++){
            tempShuffledObj = {};
            this.state.quizzProperties.forEach((p) => {
                tempShuffledObj[p] = shuffleArray(randomPropertiesCountries[i][p]);
            });
            tempShuffledArr.push(tempShuffledObj);
        }

        this.setState({randomPropertiesCountries: tempShuffledArr});
    }

    pickRandomProperties = () => {
        
        var randomProp = [];
        var pickRandomProp = (idx) => {
            var continentCountries = [...this.props.continentCountries];
            var tempProp = {};
            var tempArr, randomNumber;
            var properties = this.state.quizzProperties;

            properties.forEach((prop) => {
                tempArr = [];
                for(let i = 0; i < 3; i++){
                    randomNumber = Math.floor(Math.random() * continentCountries.length);
                    if(continentCountries[randomNumber][prop] !== this.props.countries[idx][prop]){
                        tempArr.push(continentCountries[randomNumber][prop]);
                    }else{
                        i--;
                    }
                    continentCountries.splice(randomNumber, 1);
                }
                tempArr.splice( Math.floor(Math.random()*3), 0, this.props.countries[idx][prop]);
                tempProp[prop] = tempArr;
            });
            return tempProp;
        };
        
        for(let i = 0; i < this.props.nbCountries; i++){
            randomProp.push(pickRandomProp(i));
        }


        this.mixCountriesProperties(randomProp);
    }

    changeStep = (newStep) => {
        this.setState({step: newStep});
    }

    setAnswersAndScore = (quizzAnswers, tempScore) => {
        this.setState({
            quizzAnswers: quizzAnswers,
            score: tempScore,
        });
    }

    displayGoHomeButton(){
        if(this.state.score.nbAnswers === this.props.nbCountries * this.state.quizzProperties.length){
            return(
                <Link to="/">
                    <button type="button" className="btn btn-primary">
                        Go home
                    </button>
                </Link>
            )
        }
    }

    render() {
        if(!this.props.countries || this.props.countries.length === 0){
            return <Redirect to="/"/>
        }

        return (
            <div>
                <Progress 
                    step={this.state.step}
                    nbCountries={this.props.nbCountries}
                    quizzProperties={this.state.quizzProperties}
                    quizzAnswers={this.state.quizzAnswers}
                    score={this.state.score}
                />
                <div>

                    <div className="country-buttons-container">                
                        <Step
                            step={this.state.step}
                            nbCountries={this.props.nbCountries}
                            next={false}
                            changeStep={this.changeStep.bind(this)}
                        />
                        <div className="country-info">
                            <div className="country-container">
                                <img src={this.props.countries[this.state.step].flag} alt="country" height="100" />
                            </div>
                        </div>
                        <Step
                            step={this.state.step}
                            nbCountries={this.props.nbCountries}
                            next={true}
                            changeStep={this.changeStep.bind(this)}
                        />
                    </div>
                    <Answers
                        step={this.state.step}
                        nbCountries={this.props.nbCountries}
                        quizzProperties={this.state.quizzProperties}
                        quizzAnswers={this.state.quizzAnswers}
                        score={this.state.score}
                        randomPropertiesCountries={this.state.randomPropertiesCountries}
                        countries={this.props.countries}
                        setAnswersAndScore={this.setAnswersAndScore.bind(this)}
                    />
                    <div className="confirm-button">
                       {this.displayGoHomeButton()}
                    </div>
                </div>
            </div>
        )
    }
}

/**
 * getCountryProperty = (prop) => {
        return this.props.countries[this.state.step][prop];
    }

    getCurrentProperties = (prop) => {
        if(!(this.state.randomPropertiesCountries.length > 0)){
            return null;
        }

        return this.state.randomPropertiesCountries[this.state.step][prop];
    }
 */
