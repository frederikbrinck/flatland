import React, { Component } from 'react';
import './Navigation.css';

class Navigation extends Component {
	render() {
		let style = 'progress-hidden';
		if (this.props.level >= this.props.target) 
			style = 'progress-passed';

		return (
			<div className={`${style} nav-bar`}>
				{ this.props.previous ? 
					<div className="nav-left">
						<button onClick={this.props.setScene.bind(null, this.props.previous.scene)}>{this.props.previous.title}</button>
					</div> : null }

				{ this.props.next ? 
					<div className="nav-right">
						<button onClick={this.props.setScene.bind(null, this.props.next.scene)}>{this.props.next.title}</button>
					</div> : null }
			</div>
		)
	}
}

export default Navigation;