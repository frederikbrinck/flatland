import React, { Component } from 'react';
import * as Three from 'three';
import React3 from 'react-three-renderer';
import Immutable from 'immutable';

import FlatLandCitizen from './FlatLandCitizen.js';
import Navigation from './../logic/Navigation.js';
import Progress from './../logic/Progress.js';
import InteractiveCanvas from './../logic/InteractiveCanvas.js';
import './assets/nature.css'

class Nature extends Component {
	constructor(props, context) {
		super(props, context);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.getMouseDirectionVector = this.getMouseDirectionVector.bind(this);

		this.interaction = [{
			width:700,
			height:200,
			cameraPosition: new Three.Vector3(0, 0, 10),
			cameraLookAt: new Three.Vector3(0, -0.5, 0),
			lightPosition: new Three.Vector3(20, -20, 15),
			targetProgress: 1,
			trianglePosition: new Three.Vector3(0, -0.5, 0)
		}, {
			width:700,
			height:200,
			cameraPosition: new Three.Vector3(0, 0, 20),
			cameraLookAt: new Three.Vector3(0, -0.5, 0),
			lightPosition: new Three.Vector3(30, 30, 20),
			targetProgress: 2,
			trianglePosition: new Three.Vector3(-30, -0.5, 0),
			squarePosition: new Three.Vector3(0, -0.5, 0),
			pentagonPosition: new Three.Vector3(30, -0.5, 0)
		}];
		this.state = {
			trackVector: null,
			interaction: [{
				track: false,
				rotation: new Three.Euler(-0.8585, 0.2575, 2.9641)
			}, {
				track: false,
				rotation: new Three.Euler(-0.8585, 0.2575, 2.9641)
			}]
		}
	}

	componentDidMount() {
		window.addEventListener('mousedown', this.handleMouseDown);
		window.addEventListener('mouseup', this.handleMouseUp);
		window.addEventListener('mousemove', this.handleMouseMove);
	}


  	componentWillUnmount() {
  		window.removeEventListener('mousedown', this.handleMouseDown);
		window.removeEventListener('mouseup', this.handleMouseUp);
		window.removeEventListener('mousemove', this.handleMouseMove);
   	}

   	handleMouseDown(event) {
   		let trackVector = this.getMouseDirectionVector(event),
   			interaction = Immutable.fromJS(this.state.interaction);
   		if (event.target.parentNode.className.split(' ').indexOf('singleRotate') !== -1)
   			interaction = interaction.setIn([0, 'track'], true);
   		else if (event.target.parentNode.className.split(' ').indexOf('multiRotate') !== -1) 
   			interaction = interaction.setIn([1, 'track'], true);

   		interaction = interaction.toJS();
   		this.setState({ trackVector, interaction });
   	}

   	handleMouseUp() {
   		let interaction = Immutable.fromJS(this.state.interaction).map(obj => obj.set('track', false)).toJS();
   		this.setState({ interaction });
   	}

   	handleMouseMove(event) {
   		let interaction  = this.state.interaction;
   		for (let index = 0; index < interaction.length; ++index) {
   			if (interaction[index].track) {
   				// Get rotation vector
	   			let currentVector = this.getMouseDirectionVector(event),
	   				moved 		  = currentVector.clone().sub(this.state.trackVector),
	   				speed		  = 20;	

	   			// Rotate coordinate system
		 		let cur   	 = new Three.Matrix4().makeRotationFromEuler(interaction[index].rotation.clone()),
		 			rotY  	 = new Three.Matrix4().makeRotationY(moved.x * speed),
		 			rotX  	 = new Three.Matrix4().makeRotationX(moved.y * -speed),
		 			rotation = new Three.Euler().setFromRotationMatrix(rotX.multiply(rotY).multiply(cur));

				// Set state and update track vector
				this.checkRotation(rotation, this.interaction[index].targetProgress);

				let interactionState = Immutable.fromJS(this.state.interaction);
				interactionState = interactionState.setIn([index, 'rotation'], rotation).toJS();
				this.setState({ interaction: interactionState, trackVector: currentVector });
   			}
   		}
   	}

   	getMouseDirectionVector(event){
		var r = 5;
		var x = -1 + 2 * event.clientX / this.props.screenWidth;
		var y = -1 + 2 * (this.props.screenHeight - event.clientY) / this.props.screenHeight;
		var z = Math.sqrt(r*r-x*x-y*y);
		return new Three.Vector3(x, y, z).normalize();
	}

	checkRotation(rotation, target) {
		if (this.props.progress < target) {
			let matrix 			= new Three.Matrix4().makeRotationFromEuler(rotation),
				targetNormal	= new Three.Vector3(0, 1, 0),
				normal 			= new Three.Vector3(0, 0, 1),
				rotatedNormal 	= normal.clone().applyMatrix4(matrix);
			rotatedNormal.x = Math.abs(rotatedNormal.x);
			rotatedNormal.y = Math.abs(rotatedNormal.y);
			rotatedNormal.z = Math.abs(rotatedNormal.z);

			let angle = Math.acos(rotatedNormal.dot(targetNormal));
			if (Math.abs(angle) < 0.07) {
				this.props.setProgress(target);
			}
		}
	}

	render() {
		let singleRotate = 0,
			multiRotate = 1;
		return (
			<div className="container-nature">
				<Progress level={this.props.progress} target={0}>
					<p>I call our world Flatland, not because we call it so, but to make its nature clearer to you, my happy visitor, who are privileged to live in Space.</p>
					<p>Imagine a vast screen on which straight Lines, Triangles, Squares, Pentagons, Hexagons, and other figures, instead of remaining fixed in their places, move freely about, on or in the surface, but without the power of rising above or sinking below it, very much like shadows &mdash; only hard and with luminous edges &mdash; and you will then have a pretty correct notion of my country and countrymen. Alas, a few years ago, I should have said "my universe": but now my mind has been opened to higher views of things.</p>
					<p>Let me place this Triangle on the middle of your screen in Space. Can you rotate it so it appears before you as a straight horizontal line by clicking and dragging it?</p>
					<InteractiveCanvas className="singleRotate" level={this.props.progress} target={this.interaction[singleRotate].targetProgress}
						title="Progress" text="You helped our Square! Now move on with the story below.">
						<React3 mainCamera="persp" 
							ref="canvas"
							width={this.interaction[singleRotate].width} 
							height={this.interaction[singleRotate].height} 
							clearColor={0xffffff}> 
							<scene>
								<perspectiveCamera name="persp"
							        fov={75}
							        aspect={this.interaction[singleRotate].width / this.interaction[singleRotate].height}
							        near={0.1} far={1000}
							        lookAt={this.interaction[singleRotate].cameraLookAt}
									position={this.interaction[singleRotate].cameraPosition}/>
								<ambientLight color={0xaaaaaa}/>
								<directionalLight 
									position={this.interaction[singleRotate].lightPosition}/>
								<FlatLandCitizen 
									segments={3}
									position={this.interaction[singleRotate].trianglePosition}
									rotation={this.state.interaction[singleRotate].rotation}
									radius={5} height={1}>
									<meshLambertMaterial side={Three.DoubleSide} color={0x000000}/>
								</FlatLandCitizen>
							</scene>
						</React3>
					</InteractiveCanvas>
				</Progress>
				<Progress level={this.props.progress} target={1}>
					<p>The same thing would happen if you were to treat in the same way a Square, or Pentagon, or any other figure cut out of pasteboard. As soon as you look at it from a specific vantage point, as above, you will find that it ceases to appear to you a figure, and that it becomes in appearance a straight line. Do you contest this? See it for yourself by yet another time dragging and moving your mouse.</p>
					<InteractiveCanvas className="multiRotate" level={this.props.progress} target={this.interaction[multiRotate].targetProgress}
						title="Progress" text="Hmm... Does this make it easy to navigate in Flatland?">
						<React3 mainCamera="persp" 
							ref="canvas"
							width={this.interaction[multiRotate].width} 
							height={this.interaction[multiRotate].height} 
							clearColor={0xffffff}> 
							<scene>
								<perspectiveCamera name="persp"
							        fov={75}
							        aspect={this.interaction[multiRotate].width / this.interaction[multiRotate].height}
							        near={0.1} far={1000}
							        lookAt={this.interaction[multiRotate].cameraLookAt}
									position={this.interaction[multiRotate].cameraPosition}/>
								<ambientLight color={0xaaaaaa}/>
								<directionalLight 
									position={this.interaction[multiRotate].lightPosition}/>
								<FlatLandCitizen 
									segments={3}
									position={this.interaction[multiRotate].trianglePosition}
									rotation={this.state.interaction[multiRotate].rotation}
									radius={5} height={1}>
									<meshLambertMaterial side={Three.DoubleSide} color={0x000000}/>
								</FlatLandCitizen>
								<FlatLandCitizen 
									segments={4}
									position={this.interaction[multiRotate].squarePosition}
									rotation={this.state.interaction[multiRotate].rotation}
									radius={5} height={1}>
									<meshLambertMaterial side={Three.DoubleSide} color={0x000000}/>
								</FlatLandCitizen>
								<FlatLandCitizen 
									segments={5}
									position={this.interaction[multiRotate].pentagonPosition}
									rotation={this.state.interaction[multiRotate].rotation}
									radius={5} height={1}>
									<meshLambertMaterial side={Three.DoubleSide} color={0x000000}/>
								</FlatLandCitizen>
							</scene>
						</React3>
					</InteractiveCanvas>
				</Progress>
				<Progress level={this.props.progress} target={2}>
					<p>Well, that is just what we see when one of our triangular or other acquaintances comes toward us in Flatland. As there is neither sun with us, nor any light of such a kind as to make shadows, we have none of the helps to the sight that you have in Spaceland. If our friend comes closer to us we see his line becomes larger; if he leaves us it becomes smaller: but still he looks like a straight line; be he a Triangle, Square, Pentagon, Hexagon, Circle, what you will &mdash; a straight Line he looks and nothing else. You may perhaps ask how under these disadvantageous circumstances we are able to distinguish our friends from one another: but the answer to this very natural question, dear visitor, is quite simple.</p>
				</Progress>
				<Navigation level={this.props.progress} target={2}
							setScene={this.props.setScene}
							next={this.props.next} 
							previous={this.props.previous}/>
			</div>
		)
		
	}
}

export default Nature;