import React, { Component } from 'react';
import Immutable, { Map } from 'immutable';
import './FlatLand.css';

import Chapter from './logic/Chapter.js';
import Footer from './logic/Footer.js'
import Intro from './scenes/Intro.js';
import Nature from './scenes/Nature.js';
import Feeling from './scenes/Feeling.js';
import Navigate from './scenes/Navigate.js';
import Final from './scenes/Final.js';
import End from './scenes/End.js';

const Components = {
	intro: 	{ component: Intro },
	nature: { component: Nature, 
			  chapterNumber: 1, 
			  chapterTitle: 'Of the Nature of Flatland',
			  properties: {
				  screenWidth: screen.width,
				  screenHeight: screen.height,
				  next: {
				  	title: 'Chapter 2 \u27f6',
				  	scene: 'feeling'
				  }
			  }
	},
	feeling:  {  component: Feeling,
				 noArrows: true,
				 chapterNumber: 2, 
				 chapterTitle: 'Of Our Methods of Recognizing one another' ,
				 properties: { 
					next: {
						title: 'Chapter 3 \u27f6',
						scene: 'navigate'
					},
					previous: {
						title: '\u27f5 Chapter 1',
						scene: 'nature'
					}
				}
	},
	navigate:  { component: Navigate,
				 chapterNumber: 3, 
				 chapterTitle: 'Of Recognition by Sight' ,
				 properties: { 
					triangles: 6,
					squares: 6,
					pentagons: 5,
					next: {
						title: 'Chapter 4 \u27f6',
						scene: 'final'
					},
					previous: {
						title: '\u27f5 Chapter 2',
						scene: 'feeling'
					}
				}
	},
	final:{ component: Final,
			chapterNumber: 4, 
			chapterTitle: 'How I then tried to diffuse the Theory of Three Dimensions' ,
			properties: { 
				next: {
					title: 'The End \u27f6',
					scene: 'end'
				},
				previous: {
					title: '\u27f5 Chapter 3',
					scene: 'navigate'
				}
			}
	},
	end: {  component: End }
};

class FlatLand extends Component {
	constructor(props, context) {
		super(props, context);
		this.setScene = this.setScene.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.setProgress = this.setProgress.bind(this);

		// Set initial state.
		this.state = {
			scene: 'intro',
			progress: {
				intro: 0,
				nature: 0,
				feeling: 0,
				navigate: 0,
				final: 0,
				end: 0
			},
			interaction: {
				up:false,
				down:false,
				left:false,
				right:false
			}
		};
	}

	componentDidMount() {
		window.addEventListener("keydown", this.handleKeyDown);
		window.addEventListener("keyup", this.handleKeyUp);
	}


  	componentWillUnmount() {
  		window.removeEventListener("keydown", this.handleKeyDown);
		window.removeEventListener("keyup", this.handleKeyUp);
   	}

   	setScene(scene) {
   		console.log(`Setting scene to ${scene}`);
   		this.setState({ scene });
   		window.scrollTo(0, 0);
   	}

   	setProgress(progress) {
   		let progressIm = Immutable.fromJS(this.state.progress);
   		progressIm = progressIm.set(this.state.scene, progress).toJS();
   		this.setState({ progress: progressIm});
   	}

	handleKeyDown(event) {
		let interaction = Immutable.Map(this.state.interaction);
		if (event.keyCode === 37) interaction = interaction.setIn(['left'], true).toJS();
		if (event.keyCode === 38) interaction = interaction.setIn(['up'], true).toJS();
		if (event.keyCode === 39) interaction = interaction.setIn(['right'], true).toJS();
		if (event.keyCode === 40) interaction = interaction.setIn(['down'], true).toJS();
		if ((event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) && !Components[this.state.scene].noArrows)
			event.preventDefault();
		this.setState({ interaction });
	}	

	handleKeyUp(event) {
		let interaction = Map(this.state.interaction);
		if (event.keyCode === 37) interaction = interaction.setIn(['left'], false).toJS();
		if (event.keyCode === 38) interaction = interaction.setIn(['up'], false).toJS();
		if (event.keyCode === 39) interaction = interaction.setIn(['right'], false).toJS();
		if (event.keyCode === 40) interaction = interaction.setIn(['down'], false).toJS();
		if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40)
			event.preventDefault();
		this.setState({ interaction });
	}

	render() {
		const width  = window.innerWidth,
			  height = window.innerHeight;

		let chapterTitle 	= (Components[this.state.scene].chapterTitle) ? Components[this.state.scene].chapterTitle : undefined,
			chapterNumber 	= (Components[this.state.scene].chapterNumber) ? Components[this.state.scene].chapterNumber : undefined,
			Scene 			= Components[this.state.scene].component;
		return (
			<div className="application">
				<div className="container">
					{ (chapterTitle && chapterNumber) ? <Chapter number={chapterNumber} title={chapterTitle}/> : null }
					<Scene 
						setScene={this.setScene}
						setProgress={this.setProgress}
						interaction={this.state.interaction}
						width={width}
						height={height}
						progress={this.state.progress[this.state.scene]}
						{...Components[this.state.scene].properties}/>
					{ (chapterTitle && chapterNumber) ? <Footer/> : null }
				</div>
			</div>

		)
	}
}

export default FlatLand;
