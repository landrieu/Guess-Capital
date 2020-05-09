import React, { Component } from 'react'
//import './Header.css';

export default class Step extends Component {
    componentDidMount(){
        console.log(this.props);
    }

    setStep = (increment) => {
        if(!increment && this.props.step < 1)  return;
        if(increment && this.props.step === (this.props.nbCountries - 1)) return;
        let newState = increment ? this.props.step + 1 : this.props.step - 1;

        this.props.changeStep(newState);
    }

    render(){
        return(
            <div className="section-play-buttons">
                <button 
                    type="button" 
                    className={(this.props.step !== (this.props.next ? (this.props.nbCountries - 1) : 0)) ? "btn btn-primary" : "btn btn-secondary"} 
                    onClick={this.setStep.bind(this, this.props.next)}>
                        {this.props.next ? "Next" : "Previous"}
                </button>
            </div>
        )
    }
}