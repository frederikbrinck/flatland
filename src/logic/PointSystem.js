import React, { Component } from 'react';
import './PointSystem.css';

class PointSystem extends Component {
	render() {
		return (
			<div className="point-system">
				<div className="point-correct">
					<p>Correct: {this.props.correct}</p>
				</div>
				<div className="point-wrong">
					<p>Wrong: {this.props.wrong}</p>
				</div>
			</div>
		)
	}

}

export default PointSystem;