import React, { Component } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import './Play.css';

export default class Play extends Component {
    state = {
        step: 0,
        challengeSteps: [],
        quizzAnswers: [],
        randomPropertiesCountries: [],
        //currentSuggestions: null,
        quizzProperties: ["name", "capital"/*, "population"*/],
        currentAnswer: {},
        score: {
            goodAnswers: 0,
            nbAnswers: 0
        }
    }

    componentDidMount(){
        this.pickRandomProperties();
        
        var n = 10;
        var arr = []
        for (var i = 0; i < n; i++){
            arr.push({});
        }
        this.setState({quizzAnswers: arr});
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

        var tempShuffledArr = [];
        var tempShuffledObj = {};
        
        for(let i = 0; i < 10; i++){
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
    }

    getStep = () => {
        return this.state.step;
    }

    getCountryProperty = (prop) => {
        return this.props.countries[this.getStep()][prop];
    }

    /*setCurrentSuggestions = (step) => {
        console.log(s + " " + this.state.step);
        let s =  step || this.state.step;
        this.setState({currentSuggestions: this.state.randomPropertiesCountries[s]});
    }*/
    getCurrentProperties = (prop) => {
        if(!(this.state.randomPropertiesCountries.length > 0)){
            return null;
        }
        console.log(prop);
        return this.state.randomPropertiesCountries[this.getStep()][prop];
    }

    getProgressBarStyle = () => {
        return {
            width: (100 * (this.state.step / 9)) + "%",
        }
    }

    createRounds = () => {
        let rounds = [];
        let answeredDone;
        let nbProperties = this.state.quizzProperties.length;

        for (let i = 0; i < 10; i++) {
            answeredDone = 0
            if(this.state.quizzAnswers.length > 0){
                for(let j = 0; j < this.state.quizzProperties.length; j++){
                    if(this.state.quizzAnswers[i][this.state.quizzProperties[j]]){
                        answeredDone += 1;
                    }
                }
            }

            rounds.push(
            <div className="round" key={"round" + i}>
                <div className="partial-round" style={{height: ((answeredDone/nbProperties) * 100) + "%"}}>
                </div>
            </div>
            )
        }
        return rounds
    }

    setAnswer = (prop, ans) => {
        if(!this.state.quizzAnswers[this.state.step][prop]){
            this.state.quizzAnswers[this.state.step][prop] = ans;
            let tempScore = this.state.score;
 
            if(ans === this.props.countries[this.state.step][prop]){
                tempScore.goodAnswers += 1;
            }
            tempScore.nbAnswers += 1;
    
            this.setState({quizzAnswers: this.state.quizzAnswers, score: tempScore});
        }
    }

    getAnswerStyle = (prop, p) => {
        let step = this.state.step;
        let correctAnswer = this.props.countries[step][prop];
        let currentAnswer = this.state.quizzAnswers[this.state.step][prop];
        let backgroundColor = "#f5f5f5";
        let color = "#212529";
        let fontWeight = "normal";
        let borderColor = "#a5a5a5";

        //let correctSuggestion = correctAnswer === p;
        //let isUserCorrect = correctAnswer === currentAnswer;

        if(correctAnswer === p && correctAnswer === currentAnswer){
            backgroundColor = "#2aa876";
            color = "white";
            fontWeight = 500;
            borderColor = "#2ba896";
        }else if(currentAnswer && currentAnswer === p){
            backgroundColor = "#e8554e";
            color = "white";
            fontWeight = 500;
            borderColor = "#e85549";
        }else if(currentAnswer && correctAnswer === p){
            backgroundColor = "#2aa876";
            color = "white";
            fontWeight = 500;
            borderColor = "#2ba896";
        }

        return{
            backgroundColor: backgroundColor,
            color: color,
            fontWeight: fontWeight,
            borderColor: borderColor
        }
    }

    confirmAnswers = () => {
        console.log("Confirm");
        
    }

    renderRandomProp(prop){        
        return(
            (this.state.randomPropertiesCountries.length > 0) && this.state.randomPropertiesCountries[this.state.step][prop].map((p, i) => {
                return(
                <div className="suggestion" key={p+i} onClick={this.setAnswer.bind(this, prop, p)} style={this.getAnswerStyle(prop, p)}>{p}</div>
            )
        })
        )
    }

    render() {
        return (
            <div>
                <div className="header-score">
                    <b>Score {this.state.score.goodAnswers}/{this.state.score.nbAnswers}</b>
                </div>
                <div className="progress-bar-container">
                    <div className="progress-bar-quizz">
                        <div className="progress-bar-quizz-fill" style={this.getProgressBarStyle()}></div>
                    </div>
                    <div className="round-steps">
                        {this.createRounds()}
                    </div>
                </div>
                <div>
                    <div className="country-buttons-container">                
                        <div className="section-play-buttons">
                            <button type="button" className={(this.state.step !== 0) ? "btn btn-primary" : "btn btn-secondary"} onClick={this.setStep.bind(this, false)}>Previous</button>
                        </div>
                        <div className="country-info">
                            <div className="country-container">
                                <img src={this.props.countries[this.getStep()].flag} alt="country" height="100" />
                            </div>
                        </div>
                        <div className="section-play-buttons">
                            <button type="button" className={(this.state.step !== 9) ? "btn btn-primary" : "btn btn-secondary"} onClick={this.setStep.bind(this, true)}>Next</button>
                        </div>
                    </div>
                    <div className="quizz-info">
                    {this.state.quizzProperties.map((prop, i) => {                       
                        return (
                        <div className="" key={i + " " + prop} >
                            <div className="quizz-prop-container">
                                <div className="quizz-prop-inner">
                                    {this.renderRandomProp(prop)}
                                </div>
                            </div>
                        </div>
                        ) 
                    })}
                    </div>
                    <div className="confirm-button">
                       
                    </div>
                </div>
            </div>
        )
    }
}
//<button type="button" className="btn btn-primary" onClick={this.confirmAnswers.bind(this)}>Confirm</button>
/* 
<p>Name: <b>{this.props.countries[this.state.step].name}</b><br></br>
    Population: <b>{this.props.countries[this.state.step].population}</b><br></br>
    Region: <b>{this.props.countries[this.state.step].region}</b><br></br>
    Subregion: <b>{this.props.countries[this.state.step].subregion}</b><br></br>
    Capital: <b>{this.props.countries[this.state.step].capital}</b></p>
*/


/**
 * 
 */