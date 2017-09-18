import React, { Component } from 'react';
import './Chapter.css';

class Chapter extends Component {
	render() {
		return (
			<div className="container-chapter">
				<div className="chapter-title">
					<h1>{this.props.number}</h1>
					<div className="chapter-line">
						<h2>{this.props.title}</h2>
						<hr/>
					</div>
				</div>
			</div> 
		)
	}
}

export default Chapter;