import React, { Component } from 'react';

import Progress from './../logic/Progress.js';
import Navigation from './../logic/Navigation.js';
import './assets/final.css';


class Final extends Component {
	render() {
		return (
			<div className="container-final">
				<Progress level={this.props.progress} target={0}>
					<p>Now that you have witnessed Flatland, dear visitor, I can tell that after I transcended into Space, I awoke rejoicing, and began to reflect on the glorious career before me. I would go forth, methought, at once, and evangelize the whole of Flatland. Even to Women and Soldiers should the Gospel of Three Dimensions be proclaimed. I would begin with my Wife.</p>
					<p>Just as I had decided on the plan of my operations, I heard the sound of many voices in the street commanding silence. Then followed a louder voice. It was a herald's proclamation. Listening attentively, I recognized the words of the Resolution of the Council, enjoining the arrest, imprisonment, or execution of any one who should pervert the minds of the people by delusions, and by professing to have received revelations from another World.</p>
					<p>Eager to preach my knew found knowledge, I quickly overstepped and was caught. Henceforth, the endless time has found me imprisonned &mdash; a condition that I shall not be freed from.</p>
					<p>Alas, heavily weighs on me at times the burdensome reflection that I cannot honestly say I am confident as to the exact shape of the once-seen, oft-regretted Cube; and in my nightly visions the mysterious precept, "Upward, not Northward," haunts me like a soul-devouring Sphinx. It is part of the martyrdom which I endure for the cause of the Truth that there are seasons of mental weakness, when Cubes and Spheres flit away into the background of scarce-possible existences; when the Land of Three Dimensions seems almost as visionary as the Land of One or None; nay, when even this hard wall that bars me from my freedom, these very tablets on which I am writing, and all the substantial realities of Flatland itself, appear no better than the offspring of a diseased imagination, or the baseless fabric of a dream.</p>
				</Progress>
				<Navigation level={this.props.progress} target={0}
							setScene={this.props.setScene}
							next={this.props.next} 
							previous={this.props.previous}/>
			</div>
		)
		
	}
}

export default Final;

