import React, { Component } from 'react';
import * as Three from 'three';
import React3 from 'react-three-renderer';


import FlatLandCitizen from './FlatLandCitizen.js';
import Navigation from './../logic/Navigation.js';
import Progress from './../logic/Progress.js';
import InteractiveCanvas from './../logic/InteractiveCanvas.js';
import './assets/feeling.css';

class Nature extends Component {
	constructor(props, context) {
		super(props, context);
		this.handleChange = this.handleChange.bind(this);

		this.interaction = {
			width:700,
			height:200,
			cameraPosition: new Three.Vector3(0, 0, 1),
			cameraLookAt: new Three.Vector3(0, 0, 1),
			targetProgress: 1,
			triangleRotation: new Three.Euler(0, 0, 0),
			trianglePosition: new Three.Vector3(-3.5, 0, 0),
			pentagonRotation: new Three.Euler(0, 0, 0),
			pentagonPosition: new Three.Vector3(3.5, 0, 0),
		};
		this.state = {
			triangleAngle: (this.props.progress === 1) ? 60 : 0,
			pentagonAngle: (this.props.progress === 1) ? 108 : 0
		}
	}

	handleChange(polygon, e) {
		let stateChange = () => {
			if (parseInt(this.state.triangleAngle, 10) === 60 && parseInt(this.state.pentagonAngle, 10) === 108) {
				this.props.setProgress(this.interaction.targetProgress);
			}
		}
		if (parseInt(e.target.value, 10) || e.target.value === '') {
			if (polygon === 'triangle') this.setState({ triangleAngle: e.target.value }, () => { stateChange.bind(this)(); });
			if (polygon === 'pentagon') this.setState({ pentagonAngle: e.target.value }, () => { stateChange.bind(this)(); });
		}
	}


	render() {
		return (
			<div className="container-nature">
				<Progress level={this.props.progress} target={0}>
					<p>You, who are blessed with shade as well as light, you, who are gifted with two eyes, endowed with a knowledge of perspective, and charmed with the enjoyment of various colours, you, who can actually see an angle, and contemplate the complete circumference of a Circle in the happy region of the Three Dimensions &mdash; how shall I make clear to you the extreme difficulty which we in Flatland experience in recognizing one another's configuration?</p>
					<p>To understand the power of Space, I ask of you, my visitor, to fill in the degree of one of the many angles of the polygons below by sight.</p>
					<InteractiveCanvas level={this.props.progress} target={this.interaction.targetProgress}
						title="Progress" text="By the aid of sight and a bit of math, was not that easy?">
						<div className="feeling-angle feeling-triangle">
							Angle: <input type="text" onChange={this.handleChange.bind(null, 'triangle')} value={this.state.triangleAngle}/>
						</div>
						<div className="feeling-angle feeling-pentagon">
							Angle: <input type="text" onChange={this.handleChange.bind(null, 'pentagon')} value={this.state.pentagonAngle}/>
						</div>
						<React3 mainCamera="ortho"
							ref="canvas"
							width={this.interaction.width} 
							height={this.interaction.height} 
							clearColor={0xffffff}> 
							<scene>
								<orthographicCamera name="ortho"
							        left={-this.interaction.width/100}
							        right={this.interaction.width/100}
							        top={-this.interaction.height/100}
							        bottom={this.interaction.height/100}
							        near={0.1} far={1000}
							        lookAt={this.interaction.cameraLookAt}
									position={this.interaction.cameraPosition}/>
								<ambientLight color={0xaaaaaa}/>
								<directionalLight 
									position={this.interaction.lightPosition}/>
								<FlatLandCitizen 
									segments={3}
									position={this.interaction.trianglePosition}
									rotation={this.interaction.triangleRotation}
									radius={2} height={1}>
									<meshLambertMaterial side={Three.DoubleSide} color={0x000000}/>
								</FlatLandCitizen>
								<FlatLandCitizen 
									segments={5}
									position={this.interaction.pentagonPosition}
									rotation={this.interaction.pentagonRotation}
									radius={2} height={1}>
									<meshLambertMaterial side={Three.DoubleSide} color={0x000000}/>
								</FlatLandCitizen>
							</scene>
						</React3>
					</InteractiveCanvas>
				</Progress>
				<Progress level={this.props.progress} target={1}>
					<p>Recall what I told you above. All beings in Flatland, animate or inanimate, no matter what their form, present to our view the same, or nearly the same, appearance, viz. that of a straight Line. How then can one be distinguished from another, where all appear the same?</p>
					<p>Feeling is, among our lower classes &mdash; about our upper classes I shall speak presently &mdash; the principal test of recognition, at all events between strangers, and when the question is, not as to the individual, but as to the class. What therefore "introduction" is among the higher classes in Spaceland, that the process of "feeling" is with us.</p>
					<p>Let not my visitor however suppose that "feeling" is with us the tedious process that it would be with you, or that we find it necessary to feel right round all the sides of every individual before we determine the class to which he belongs. Long practice and training, begun in the schools and continued in the experience of daily life, enable us to discriminate at once by the sense of touch, between the angles of an equal-sided Triangle, Square, and Pentagon. It is therefore not necessary, as a rule, to do more than feel a single angle of an individual; and this, once ascertained, tells us the class of the person whom we are addressing, unless indeed he belongs to the higher sections of the nobility. There the difficulty is much greater. Even a Master of Arts in our University of Wentbridge has been known to confuse a ten-sided with a twelve-sided Polygon; and there is hardly a Doctor of Science in or out of that famous University who could pretend to decide promptly and unhesitatingly between a twenty-sided and a twenty-four sided member of the Aristocracy.</p>
				</Progress>
				<Navigation level={this.props.progress} target={1}
							setScene={this.props.setScene}
							next={this.props.next} 
							previous={this.props.previous}/>
			</div>
		)
		
	}
}

export default Nature;