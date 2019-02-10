import React, { Component } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import {Redirect, Link} from 'react-router-dom';
import update from 'react-addons-update'; 
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
            var continentCountries = cloneDeep(this.props.continentCountries);
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

    setStep = (increment) => {
        if(!increment && this.state.step < 1)  return;
        if(increment && this.state.step === (this.props.nbCountries - 1)) return;
        let newState = increment ? this.state.step + 1 : this.state.step - 1;
        this.setState({step: newState});
    }

    getCountryProperty = (prop) => {
        return this.props.countries[this.state.step][prop];
    }


    getCurrentProperties = (prop) => {
        if(!(this.state.randomPropertiesCountries.length > 0)){
            return null;
        }

        return this.state.randomPropertiesCountries[this.state.step][prop];
    }

    getProgressBarStyle = () => {
        return {
            width: (100 * (this.state.step / (this.props.nbCountries - 1))) + "%",
        }
    }

    createRounds = () => {
        let rounds = [];
        let answeredDone;
        let nbProperties = this.state.quizzProperties.length;

        for (let i = 0; i < this.props.nbCountries; i++) {
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
            let step = this.state.step;
            let tempScore = this.state.score;
 
            if(ans === this.props.countries[this.state.step][prop]){
                tempScore.goodAnswers += 1;
            }
            tempScore.nbAnswers += 1;
    
            //this.setState({quizzAnswers: this.state.quizzAnswers, score: tempScore});
            this.setState({
                //quizzAnswers: update(this.state.quizzAnswers, {step: {name: {$set: ans}}}),
                quizzAnswers: this.state.quizzAnswers,
                score: tempScore,
            });
        }
    }

    getAnswerStyle = (prop, p) => {
        let step = this.state.step;
        let correctAnswer = this.props.countries[step][prop];
        let currentAnswer = this.state.quizzAnswers[this.state.step][prop];
        let style = defaultAnswerStyle;

        if(correctAnswer === p && correctAnswer === currentAnswer){
            style = correctAnswerStyle;
        }else if(currentAnswer && currentAnswer === p){
            style = wrongAnswerStyle;
        }else if(currentAnswer && correctAnswer === p){
            style = correctAnswerStyle;
        }

        return style;
    }

    displayGoHomeButton(){
        if(this.state.score.nbAnswers === this.props.nbCountries * this.state.quizzProperties.length){
            return(
                <Link to="/"><button type="button" className="btn btn-primary">
                    Go home
                </button></Link>
            )
        }
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
        if(!this.props.countries || this.props.countries.length === 0){
            return <Redirect to="/"/>
        }

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
                                <img src={this.props.countries[this.state.step].flag} alt="country" height="100" />
                            </div>
                        </div>
                        <div className="section-play-buttons">
                            <button type="button" className={(this.state.step !== (this.props.nbCountries - 1)) ? "btn btn-primary" : "btn btn-secondary"} onClick={this.setStep.bind(this, true)}>Next</button>
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
                       {this.displayGoHomeButton()}
                    </div>
                </div>
            </div>
        )
    }
}

const correctAnswerStyle = {
    backgroundColor: "#2aa876",
    color:           "white",
    fontWeight:      500,
    borderColor:     "#2ba896"
}

const wrongAnswerStyle = {
    backgroundColor: "#e8554e",
    color:           "white",
    fontWeight:      500,
    borderColor:     "#e85549"
}

const defaultAnswerStyle = {
    backgroundColor: "#f5f5f5",
    color:           "#212529",
    fontWeight:      "normal",
    borderColor:     "#a5a5a5"
}


/**
 * 
 */