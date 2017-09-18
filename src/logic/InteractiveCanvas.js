import React, { Component } from 'react';
import './InteractiveCanvas.css';

class InteractiveCanvas extends Component {
	render() {
		let style = 'canvas-interact',
			style2 = 'canvas-success canvas-closed';
		if (this.props.level >= this.props.target) {
			style = 'canvas-passed';
			style2 = 'canvas-success';
		}

		return (
			<div className={`${style} ${this.props.className ? this.props.className : ''}`}>
				<div className={style2}>
					<h4>{`\u27f5\u3000${this.props.title}\u3000\u27f6`}</h4>
					<p>{this.props.text}</p>
				</div>
				{this.props.children}
			</div>
		)
	}
}

export default InteractiveCanvas;