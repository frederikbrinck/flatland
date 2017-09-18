import React, { Component } from 'react';
import * as Three from 'three';
import Immutable from 'immutable';
import React3 from 'react-three-renderer';
import { animateScroll as AnimateScroll } from 'react-scroll';

import Progress from './../logic/Progress.js';
import Navigation from './../logic/Navigation.js';
import InteractiveCanvas from './../logic/InteractiveCanvas.js';
import PointSystem from './../logic/PointSystem.js';
import FlatLandCitizen from './FlatLandCitizen.js';

import './assets/navigate.css'
import displayCamera from './assets/display-camera.png';

class Navigate extends Component {
	constructor (props, context) {
		super(props, context);
		this.getCitizens = this.getCitizens.bind(this);
		this.createWorldObject = this.createWorldObject.bind(this);
		this.prepareExploration = this.prepareExploration.bind(this);
		this.handleExploration = this.handleExploration.bind(this);
		this.checkExploration = this.checkExploration.bind(this);
		this.detectCollision = this.detectCollision.bind(this);
		this.handleAnimate = this.handleAnimate.bind(this);
		this.handleChange = this.handleChange.bind(this);

		this.width 	= props.width || 100;
		this.height = props.height || 100;
		this.print = false;
		this.cameraPersp = null;
		this.correctToProgress = 2;

		// Create camera position.
		this.frustrumDivisor = 1;

		// Create light position 
		this.lightPosition = new Three.Vector3(0, 300, 500);
		this.citizenRefs = [];
		this.up = new Three.Vector3(0, 0, 1);
		this.citizenHeight = 5;

		this.foggy = {
			width:700,
			height:300,
			orthographic: {
				divisor: 100,
				near: 0.1,
				far: 100,
				lookAt: new Three.Vector3(0, 0, 0.5),
				position: new Three.Vector3(0, 0, 10),
			},
			perspective: {
				fov: 75,
				near: 0.1,
				far: 50,
				lookAt: new Three.Vector3(0, 0, 0.25),
				up: new Three.Vector3(0, 0, 1),
				position: new Three.Vector3(0, 4, 0.25),
			},
			citizen: {
				radius: 1,
				height: 0.5,
			}
		};

		let citizens = this.createWorldObject(this.citizenHeight);
		this.state = {
			foggy: {
				position: new Three.Vector3(0, -2, 0),
				rotation: new Three.Euler(0, 0, Math.PI/2),
				segments: 3,
				changedShape: false,
				moved: false,
			},
			cameraPosition: new Three.Vector3(0, 0, 700),
			cameraLookAt: new Three.Vector3(0, 0, this.citizenHeight/2),
			cameraUp: new Three.Vector3(0, 0, 1),
			worldPosition: new Three.Vector3(0, 0, 0),
			worldRotation: new Three.Euler(0, 0, 0),
			worldCamera: 'persp',
			citizens: citizens,
			navigate: false,
			prepare: false,
			scrollTop: false,
			detectedCitizen: false,
			detect: {
				correct: 0,
				wrong: 0
			}
		}
	}

	getCitizen(citizen) {
		return (
			<FlatLandCitizen 
				key={citizen.id}
				ref={(citizenRef) => this.citizenRefs[citizen.id] = citizenRef}
				segments={citizen.vertices}
				position={citizen.position}
				radius={citizen.radius} height={citizen.height}>
				<meshLambertMaterial color={citizen.color}/>
			</FlatLandCitizen>
		);
	}

	getCitizens() {
		let citizens = [];
		for (let citizen of this.state.citizens) {
			let citizenJSX = this.getCitizen(citizen);
			citizens.push(citizenJSX);
		}
		return citizens;
	}

	// This function should be simplified.
	createWorldObject(citizenHeight) {
		let triangles 	= this.props.triangles || 0,
			squares 	= this.props.squares || 0,
			pentagons 	= this.props.pentagons || 0,
			id 			= 0,
			citizens 	= [];

		for (let i = 0; i < triangles; ++i) {
			let position = new Three.Vector3(-this.width/2 + Math.random() * this.width, 
											 -this.height/2 + Math.random() * this.height, 0);
			citizens.push({ 
				id, 
				vertices: 3,
				radius: 40,
				position,
				height: citizenHeight,
				rotation: new Three.Euler(0, 0, 0),
				color: 0x000000,
				enabled: true
			});
			id++;
		}

		for (let i = 0; i < squares; ++i) {
			let position = new Three.Vector3(-this.width/2 + Math.random() * this.width, 
											 -this.height/2 + Math.random() * this.height, 0);
			citizens.push({ 
				id, 
				vertices: 4,
				radius: 40,
				position,
				height: citizenHeight,
				rotation: new Three.Euler(0, 0, 0),
				color: 0x000000,
				enabled: true
			});
			id++;
		}

		for (let i = 0; i < pentagons; ++i) {
			let position = new Three.Vector3(-this.width/2 + Math.random() * this.width, 
											 -this.heigth/2 + Math.random() * this.height, 0);
			citizens.push({ 
				id, 
				vertices: 5,
				radius: 40,
				position,
				height: citizenHeight,
				rotation: new Three.Euler(0, 0, 0),
				color: 0x000000,
				enabled: true
			});
			id++;
		}

		return citizens;
	}

	prepareExploration() {
		let angle 	= -0.008,
			startZ 	= this.state.cameraPosition.z;

		const offset = document.getElementsByClassName('navigate-anchor')[0].offsetTop;
		AnimateScroll.scrollTo(offset, {
			duration: 1000,
			delay: 100,
			smooth: true,
		});

		let easeDown = () => {
			let position = new Three.Vector3(this.state.cameraPosition.x, this.state.cameraPosition.y, this.state.cameraPosition.z);
			position.y = position.y * Math.cos(angle) + position.z * Math.sin(angle);
			position.z = -position.y * Math.sin(angle) + position.z * Math.cos(angle);

			if (position.z <= this.citizenHeight / 2) {
				position.z = this.citizenHeight / 2;
				position.y = -startZ;
				let lookAt = position.clone();
				lookAt.y += 1;
				this.setState({ cameraPosition: position, cameraLookAt: lookAt, 
								navigate: true });
			} else {
				this.setState({ cameraPosition: position });
				requestAnimationFrame(easeDown);	
			}
		}
		this.setState({ prepare: true }, () => { easeDown(); });
	}

	handleExploration(citizen, guess) {
		let detect 	 = Immutable.Map(this.state.detect),
			citizens = Immutable.fromJS(this.state.citizens);

		if (citizen.vertices === guess) {
			detect 	 = detect.set('correct', parseInt(detect.get('correct'), 10) + 1).toJS();
			citizens = citizens.setIn([citizen.id, 'color'], 0x009993);
		} else {
			detect   = detect.set('wrong', parseInt(detect.get('wrong'), 10) + 1).toJS();
			citizens = citizens.setIn([citizen.id, 'color'], 0x35626A);
		}

		citizens = citizens.setIn([citizen.id, 'enabled'], false).toJS();
		this.setState({ detect, citizens }, () => { this.checkExploration(); });
	}

	checkExploration() {
		if (this.state.detect.correct >= this.correctToProgress)
			this.props.setProgress(2);
	}

	detectCollision(position, collisionRadius, detectRadius) {
		let collisionRadiusSquared = collisionRadius * collisionRadius,
			detectRadiusSquared = detectRadius * detectRadius,
			collidedCitizen = false,
			detectedCitizen = { distance: Number.POSITIVE_INFINITY, citizen: false };

		for (let citizen of this.state.citizens) {
			let distance = position.distanceToSquared(citizen.position);
			if (distance < detectRadiusSquared) {
				if (distance < detectedCitizen.distance)
					detectedCitizen = { distance, citizen };
				if (distance < collisionRadiusSquared) {
					collidedCitizen = citizen;
				}
			}
				
		}	

		return [collidedCitizen, detectedCitizen.citizen];
	}

	handleAnimate() {
		let velocity = (this.props.interaction.up ? (this.props.interaction.down ? 0 : 1) : (this.props.interaction.down ? -1 : 0)),
			rotation = (this.props.interaction.left ? (this.props.interaction.right ? 0 : -1) : (this.props.interaction.right ? 1 : 0));
		
		if (!this.state.navigate) {
			let speed = 0.06;
			velocity *= speed;
			rotation *= speed/5;

			let foggyPosition = this.state.foggy.position.clone();
			foggyPosition.y = this.state.foggy.position.y - velocity;
			if (foggyPosition.y < -2) 
				foggyPosition.y = -2;
			else if (foggyPosition.y > 2) 
				foggyPosition.y = 2;

			let foggyRotation = this.state.foggy.rotation.clone();
			foggyRotation.z = this.state.foggy.rotation.z + rotation;

			let foggy = Immutable.fromJS(this.state.foggy)
				.set('position', foggyPosition)
				.set('rotation', foggyRotation);

			if (foggyPosition.y > -1)
				foggy = foggy.set('moved', true);
			foggy = foggy.toJS();
			this.setState({ foggy });

			if (this.state.foggy.moved && this.state.foggy.changedShape && this.props.progress < 1)
				setTimeout(() => { this.props.setProgress(1) }, 5000);
		}


		if (this.state.navigate) {
			let speed = 1.4;
			velocity *= speed;
			rotation *= speed/80;

			let cameraLookAt 	= this.state.cameraLookAt.clone().sub(this.state.cameraPosition).normalize();
			cameraLookAt.x 		= cameraLookAt.x * Math.cos(rotation) + cameraLookAt.y * Math.sin(rotation);
			cameraLookAt.y 		= -cameraLookAt.x * Math.sin(rotation) + cameraLookAt.y * Math.cos(rotation);
			
			let cameraPosition 						= this.state.cameraPosition.clone().add(cameraLookAt.clone().multiplyScalar(velocity)),
				[collidedCitizen, detectedCitizen] 	= this.detectCollision(cameraPosition, 40, 80); 

			cameraLookAt = cameraPosition.clone().add(cameraLookAt);
			if (collidedCitizen === false) 
				this.setState({ cameraPosition, cameraLookAt, detectedCitizen });
			else 
				this.setState({ cameraLookAt, detectedCitizen });	
		}
	}

	handleChange(e) {
		let foggy = Immutable.fromJS(this.state.foggy).set('segments', e.target.value);
		let parsed = parseInt(e.target.value, 10);
		if (parsed && parsed > 3)
			foggy = foggy.set('changedShape', true);
		foggy = foggy.toJS();
		this.setState({ foggy });
	}

	render() {
		const width 	   = window.innerWidth,
			  height 	   = window.innerHeight;
		let   leftPosition = false,
			  promptWidth  = 300,
			  cameraMargin = 100,
			  cameraFade   = 100;

		if (this.state.detectedCitizen && this.state.detectedCitizen.enabled === true) {
			let	vector = new Three.Vector3();
		    vector.setFromMatrixPosition(this.citizenRefs[this.state.detectedCitizen.id].mesh.matrixWorld);
		    vector.project(this.cameraPersp);

		    leftPosition = ( vector.x * width / 2 ) + width / 2 - promptWidth / 2;
		    if (leftPosition < cameraMargin || leftPosition > width - cameraMargin - promptWidth)
		    	leftPosition = false;

		    let lookAtVector = this.state.detectedCitizen.position.clone().sub(this.state.cameraPosition).normalize(),
				normalVector = this.state.cameraLookAt.clone().sub(this.state.cameraPosition).normalize(),
				angle 		 = Math.acos(lookAtVector.dot(normalVector)) * (180/Math.PI);
			if (Math.abs(angle) > 90)
				leftPosition = false;
		}


		const stylePosition = {
			visibility: (leftPosition !== false) ? 'visible' : 'hidden',
			opacity: (leftPosition < cameraMargin + cameraFade || leftPosition > width - cameraMargin - cameraFade - promptWidth) ? '0' : '1',
			top: '50px',
			left: `${leftPosition}px`
		};

		let segments = (parseInt(this.state.foggy.segments, 10)) ? parseInt(this.state.foggy.segments, 10) : 3;
		if (segments < 3)
			segments = 3;
		return (
			<div className="container">
				<Progress level={this.props.progress} target={0}>
					<div className="container-navigate">
						<p>While the Recognition by Feeling is stated to be universal, the visitor will find this qualification &mdash; "among the lower classes." It is only among the higher classes and in our temperate climates that Sight Recognition is practised.</p>
						<p>That this power exists in any regions and for any classes is the result of Fog; which prevails during the greater part of the year in all parts save the torrid zones. That which is with you in Spaceland an unmixed evil, blotting out the landscape, depressing the spirits, and enfeebling the health, is by us recognized as a blessing scarcely inferior to air itself, and as the Nurse of arts and Parent of sciences.</p>
						<p>But let me show you my meaning, without further eulogies on this beneficent Element. Move and rotate the element with the arrow keys to see how the fog changes our perception of the citizen. Try it with at least one non-triangle citizen.</p>
						<InteractiveCanvas level={this.props.progress} target={1}
							title="Progress" 
							text="O day and night, but this is wondrous strange! Do you now see what vital a role fog plays in Flatland?">
							<div className="foggy-display">
								Sides<input type="text" onChange={this.handleChange} value={this.state.foggy.segments}/>
							</div>
							<div className="foggy-camera">
								<img src={displayCamera}/>
							</div>
							<React3
								width={this.foggy.width} height={this.foggy.height} 
								onAnimate={this.handleAnimate}
								clearColor={0xffffff}> 
								<viewport
									x={0}
									y={0}
									width={this.foggy.width / 2}
									height={this.foggy.height}
									cameraName="ortho"/>
								<viewport
									x={this.foggy.width / 2}
									y={0}
									width={this.foggy.width / 2}
									height={this.foggy.height}
									cameraName="persp"/>
								<scene fog={ new Three.Fog(0xefefef, 0.01, 5) }>
									<orthographicCamera name="ortho"
								        left={-this.foggy.width / (2 * this.foggy.orthographic.divisor)}
								        right={this.foggy.width / (2 * this.foggy.orthographic.divisor)}
								        top={-this.foggy.height / this.foggy.orthographic.divisor}
								        bottom={this.foggy.height / this.foggy.orthographic.divisor}
								        near={this.foggy.orthographic.near} far={this.foggy.orthographic.far}
								        lookAt={this.foggy.orthographic.lookAt}
										position={this.foggy.orthographic.position}/>
									<perspectiveCamera name="persp"
								        fov={this.foggy.perspective.fov}
								        aspect={(this.foggy.width / 2) / this.foggy.height}
								        near={this.foggy.perspective.near} far={this.foggy.perspective.far}
								        lookAt={this.foggy.perspective.lookAt}
								        up={this.foggy.perspective.up}
										position={this.foggy.perspective.position}/>
									<ambientLight color={0xaaaaaa}/>
									<directionalLight position={this.lightPosition}/>
									<FlatLandCitizen 
										segments={segments}
										position={this.state.foggy.position}
										rotation={this.state.foggy.rotation}
										radius={this.foggy.citizen.radius} height={this.foggy.citizen.height}>
										<meshLambertMaterial side={Three.DoubleSide} color={0x000000}/>
									</FlatLandCitizen>
								</scene>
							</React3>
						</InteractiveCanvas>
					</div>
				</Progress>
				<Progress level={this.props.progress} target={1}>
					<div className="container-navigate">
						<p>If Fog were non-existent, all lines would appear equally and indistinguishably clear; and this is actually the case in those unhappy countries in which the atmosphere is perfectly dry and. transparent. But wherever there is a rich supply of Fog objects that are at a distance, say of three feet, are appreciably dimmer than those at a distance of two feet eleven inches; and the result is that by careful and constant experimental observation of comparative dimness and clearness, we are enabled to infer with great exactness the configuration of the object observed.</p>
						<p>An instance will do more than a volume of generalities to make my meaning clear: Click the button below and use the arrow keys to navigate Flatland once entered. I challenge you to succesfully recognize at least two of my fellow countrymen.</p>
					</div>
					<InteractiveCanvas level={this.props.progress} target={2}
						title="Progress" 
						text="How does it feel to become a part of Flatland? Move on with the story below."
						className="navigate-anchor">
						<div className="navigate-question" style={stylePosition}>
							<div className="navigate-layout">
								<h4>{`\u27f5\u3000What do I Square?\u3000\u27f6`}</h4>
								<div>
									<p>From this great moment of feeling and sight, to which class of polygons &mdash; given by the number of corners &mdash; do you gather I belong?</p>
									<div className="navigate-buttons">
										<button onClick={this.handleExploration.bind(null, this.state.detectedCitizen, 3)}>3</button>
										<button onClick={this.handleExploration.bind(null, this.state.detectedCitizen, 4)}>4</button>
										<button onClick={this.handleExploration.bind(null, this.state.detectedCitizen, 5)}>5</button>
									</div>
								</div>
							</div>
						</div>
						{ !this.state.prepare ? (<button className="navigate-begin" onClick={this.prepareExploration}>Navigate Flatland</button>) : null }
						{ (this.state.navigate && this.props.progress < 2) ? (<PointSystem {...this.state.detect}/>) : null }
						<React3 mainCamera={this.state.worldCamera} 
							width={width} height={height} 
							onAnimate={this.handleAnimate}
							clearColor={0xffffff}> 
							<scene fog={ new Three.Fog(0xefefef, 0.01, 100) }>
								<perspectiveCamera ref={(cameraPersp) => this.cameraPersp = cameraPersp} name="persp"
							        fov={75}
							        aspect={width / height}
							        near={0.1} far={1000}
							        lookAt={this.state.cameraLookAt}
							        up={this.state.cameraUp}
									position={this.state.cameraPosition}/>
								<group>
									{this.getCitizens()}
								</group>
								<ambientLight color={0xaaaaaa}/>
								<directionalLight position={this.lightPosition}/>
							</scene>
						</React3>
					</InteractiveCanvas>
				</Progress>
				<Progress level={this.props.progress} target={2}>
					<div className="container-navigate">
						<p>The visitor will probably understand from this instance how &mdash; after a very long training supplemented by constant experience &mdash; it is possible for the well-educated classes among us to discriminate with fair accuracy between the middle and lowest orders, by the sense of sight. If my Spaceland Patrons have grasped this general conception, so far as to conceive the possibility of it and not to reject my account as altogether incredible &mdash; I shall have attained all I can reasonably expect. Were I to attempt further details I should only perplex. Yet for the sake of the young and inexperienced, who may perchance infer &mdash; from the simple instance I have given above, of the manner in which I should recognize my Father and my Sons &mdash; that Recognition by sight is an easy affair, it may be needful to point out that in actual life most of the problems of Sight Recognition are far more subtle and complex.</p>
						<p>For this reason, among our Higher Classes, "Feeling" is discouraged or absolutely forbidden. From the cradle their children, instead of going to the Public Elementary schools (where the art of Feeling is taught,) are sent to higher Seminaries of an exclusive character; and at our illustrious University, to "feel" is regarded as a most serious fault, involving Rustication for the first offence, and Expulsion for the second.</p>
						<p>But among the lower classes the art of Sight Recognition is regarded as an unattainable luxury. A common Tradesman cannot afford to let his son spend a third of his life in abstract studies. The children of the poor are therefore allowed to "feel" from their earliest years, and they gain thereby a precocity and an early vivacity which contrast at first most favourably with the inert, undeveloped, and listless behaviour of the half-instructed youths of the Polygonal class; but when the latter have at last completed their University course, and are prepared to put their theory into practice, the change that comes over them may almost be described as a new birth, and in every art, science, and social pursuit they rapidly overtake and distance their Triangular competitors.</p>
						<p>Only a few of the polygonal Class fail to pass the Final Test or Leaving Examination at the University. The condition of the unsuccessful minority is truly pitiable. Rejected from the higher class, they are also despised by the lower. They have neither the matured and systematically trained powers of the Polygonal Bachelors and Masters of Arts, nor yet the native precocity and mercurial versatility of the youthful Tradesman. The professions, the public services, are closed against them; and though in most States they are not actually debarred from marriage, yet they have the greatest difficulty in forming suitable alliances, as experience shews that the offspring of such unfortunate and ill-endowed parents is generally itself unfortunate, if not positively Irregular.</p>
					</div>
				</Progress>
				<div className="container-navigate">
					<Navigation level={this.props.progress} target={2}
								setScene={this.props.setScene}
								next={this.props.next} 
								previous={this.props.previous}/>
				</div>
			</div>
		)
	}
}

export default Navigate;