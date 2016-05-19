import React, { Component, PropTypes } from 'react';
 
// Task component - represents a single todo item
export default class Compass extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			rose:{styles:{}}
		}
	}

	handleDeviceMotion(event) {
    	var g = Math.round(event.gamma);
	    var b = Math.round(event.beta);
	    var a = event.alpha;

	    var rotation = 'rotate('+(-1)*a+'deg)';
	    this.setState({rose:{styles:{'transform':rotation,'WebkitTransform':rotation}}});
  	}

  	componentWillMount() {

  		// Draw markers around circle. Could be a new component
  		const circles = this.props.markers.map((item,index)=>{
  			const angle = 360/this.props.markers.length;
  			const a = (index * (angle))+angle/2;
  			const cy = Compass.statics.circle.radius*Math.sin(a * Math.PI / 180.0) + Compass.statics.circle.cy;
  			const cx = Compass.statics.circle.radius* Math.cos(a * Math.PI / 180.0) + Compass.statics.circle.cx;
  			return <circle cy={cy} cx={ cx} r="20"  fill="blue"/>
  		})
  		
  		this.setState({markers:circles});
  	}

	componentDidMount() {
		if (window.DeviceMotionEvent){
			window.addEventListener('deviceorientation', this.handleDeviceMotion.bind(this), false);
		}
	}

	componentWillUnmount () {
		window.removeEventListener('deviceorientation', this.handleDeviceMotion, false);
	}

	render() {
		return (
			<div>
				<svg className="compass" height={Compass.statics.svg.height} width={Compass.statics.svg.width}>
					<circle cx={Compass.statics.circle.cx} cy={Compass.statics.circle.cy} r={Compass.statics.circle.radius} stroke="black" fill="black" fillOpacity="0.4"  strokeDasharray="5,5"/>
					{this.state.markers}
				</svg>
				<img id="board" style={this.state.rose.styles} src="/images/surfboard.png"/>
		  	</div>
		);
	}
}

Compass.statics = {
	circle:{
		radius:250,
		cx:250,
		cy:250
	},
	svg:{
		height:500,
		width:500
	}
}

/*
<circle cy={ 40*Math.sin(0 * Math.PI / 180.0) + 50} cx={ 40* Math.cos(0 * Math.PI / 180.0) + 50} r="5" stroke="black" stroke-width="3" fill="blue"/>
<img id="board" style={this.state.rose.styles} src="/images/surfboard.png"/>
Task.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  task: PropTypes.object.isRequired,
};
*/


