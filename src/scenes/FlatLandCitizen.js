import React, { Component } from 'react';
import Immutable from 'immutable';

class FlatLandCitizen extends Component {
	constructor(props, context) {
		super(props, context);
		this.mesh = null;
		this.radius = props.radius || 1;
		this.height = props.height || 5;
	}

	render() {
		this.lineTos = [];
		this.angle = this.props.segments ? 2 * Math.PI / this.props.segments : 120;
		for (let i = 0; i < this.props.segments; ++i)
			this.lineTos.push(<lineTo key={i}
									  x={this.radius * Math.cos(this.angle * i)} 
									  y={this.radius * Math.sin(this.angle * i)}/>);

		this.propsMesh = Immutable.Map(this.props).delete('radius').delete('segments').delete('height').toJS();
		return (
			<mesh ref={(mesh) => this.mesh = mesh} {...this.propsMesh}>
				{this.props.children}
				<extrudeGeometry amount={this.height} bevelEnabled={false}>
					<shape>
						<moveTo x={this.radius} y={0}/>
						{this.lineTos}
					</shape>
				</extrudeGeometry>
			</mesh>
		);
	}
}

export default FlatLandCitizen;