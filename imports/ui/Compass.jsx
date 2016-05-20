import React, { Component, PropTypes } from 'react';
 
// Task component - represents a single todo item
export default class Compass extends Component {
	

  	componentWillMount() {

  		// Draw markers around circle. Could be a new component
  		const circles = this.props.markers.map((item,index)=>{
  			const angle = 360/this.props.markers.length;
  			const a = (index * (angle))+angle/2;
  			const cy = Compass.statics.circle.radius*Math.sin(a * Math.PI / 180.0) + Compass.statics.circle.cy;
  			const cx = Compass.statics.circle.radius* Math.cos(a * Math.PI / 180.0) + Compass.statics.circle.cx;
  			return <circle cy={cy} cx={ cx} r="20"  fill="blue"/>
  		})
  		// Uncomment next line and then place following line into svg to see marker points in the circle
  		// this.setState({markers:circles});
  		// {this.state.markers}
  	}

	render() {

		var a = this.props.alpha||0;
	    var rotation = 'rotate('+(-1)*a+'deg)';
	    var styles = {'transform':rotation,'WebkitTransform':rotation};

		return (
			<div>
				<svg className="compass" height={Compass.statics.svg.height} width={Compass.statics.svg.width}>
					<circle cx={Compass.statics.circle.cx} cy={Compass.statics.circle.cy} r={Compass.statics.circle.radius} stroke="black" fill="black" fillOpacity="0.4"  strokeDasharray="5,5"/>
					
				</svg>
				<img id="board" style={styles} src="/images/surfboard.png"/>
		  	</div>
		);
	}
}

Compass.statics = {
	circle:{
		radius:300,
		cx:300,
		cy:300
	},
	svg:{
		height:600,
		width:600
	}
}



