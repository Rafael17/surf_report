import React, { Component, PropTypes } from 'react';
 
// Task component - represents a single todo item
export default class MotionFollowerBackground extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			rose:{styles:{}}
		}
	}

	handleDeviceMotion(event) {
    	var g = Math.round(event.gamma);
	    var b = Math.round(event.beta);
	    this.setState({styles:{'left':g,'top':b}});
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
		  <div className="bg">
		    <img id="wave" style={this.state.styles} src={this.props.image} />
		  </div>
		);
	}
}
 



