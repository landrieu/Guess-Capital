import React, { Component } from 'react'
//import './Header.css';

export default class Progress extends Component {
  componentDidMount(){
    console.log(this.props);

  }

    createRounds = () => {
        let rounds = [];
        let answeredDone;
        let nbProperties = this.props.quizzProperties.length;

        for (let i = 0; i < this.props.nbCountries; i++) {
            answeredDone = 0
            if(this.props.quizzAnswers.length > 0){
                for(let j = 0; j < this.props.quizzProperties.length; j++){
                    if(this.props.quizzAnswers[i][this.props.quizzProperties[j]]){
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
        return rounds;
    }

    getProgressBarStyle = () => {
        return {
            width: (100 * (this.props.step / (this.props.nbCountries - 1))) + "%",
        }
    }

    render() {
        return (
            <div>
                <div className="header-score">
                        <b>Score {this.props.score.goodAnswers}/{this.props.score.nbAnswers}</b>
                </div>
                <div className="progress-bar-container">
                    <div className="progress-bar-quizz">
                        <div className="progress-bar-quizz-fill" style={this.getProgressBarStyle()}></div>
                    </div>
                    <div className="round-steps">
                        {this.createRounds()}
                    </div>
                </div>
            </div>
        )
    }
}