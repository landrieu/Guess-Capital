import React, { Component } from 'react'
//import './Header.css';

export default class Answers extends Component {
    componentDidMount(){
        console.log(this.props);

    }

    renderRandomProp(prop){        
        return(
            (this.props.randomPropertiesCountries.length > 0) && this.props.randomPropertiesCountries[this.props.step][prop].map((p, i) => {
                return(
                <div 
                    className="suggestion" 
                    key={p+i} 
                    onClick={this.setAnswer.bind(this, prop, p)} 
                    style={this.getAnswerStyle(prop, p)}
                >
                    {p}
                </div>
            )
        })
        )
    }

    getAnswerStyle = (prop, p) => {
        let step = this.props.step;
        let correctAnswer = this.props.countries[step][prop];
        let currentAnswer = this.props.quizzAnswers[this.props.step][prop];
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

    setAnswer = (prop, ans) => {
        if(!this.props.quizzAnswers[this.props.step][prop]){
            this.props.quizzAnswers[this.props.step][prop] = ans;
            let tempScore = this.props.score;
 
            if(ans === this.props.countries[this.props.step][prop]){
                tempScore.goodAnswers += 1;
            }
            tempScore.nbAnswers += 1;
    
            this.props.setAnswersAndScore(this.props.quizzAnswers, tempScore);
        }
    }

    render() {
        return (
            <div className="quizz-info">
                {this.props.quizzProperties.map((prop, i) => {                       
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