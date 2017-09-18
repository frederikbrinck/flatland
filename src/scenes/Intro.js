import React, { Component } from 'react';
import './assets/intro.css';

class Intro extends Component {
	render() {
		return (
			<div className="container-intro">
				<div className="intro-header">
					<div className="intro-text">
						<h1>FLATLAND</h1>
					</div>
					<div className="intro-subheader">
						<div className="intro-subheader-position"><h2>A Romance of Many Dimensions</h2></div>
					</div>
				</div>
				
				<div className="intro-go">
					<h3>An interactive adaption of the famous romance by Frederik Jensen</h3>
					<button onClick={this.props.setScene.bind(null, 'nature')}>Take me to Flatland</button>
				</div>
			</div>
		)
		
	}
}

export default Intro;