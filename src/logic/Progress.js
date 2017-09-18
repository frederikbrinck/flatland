import React, { Component } from 'react';
import './Progress.css';

class Progress extends Component {
	render() {
		let style = 'progress-hidden';
		if (this.props.level >= this.props.target) 
			style = 'progress-passed';

		return (
			<div className={style}>
				{this.props.children}
			</div>
		)
	}
}

export { Progress as default };