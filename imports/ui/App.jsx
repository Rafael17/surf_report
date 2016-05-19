import React, { Component } from 'react';
 
import Compass from './Compass.jsx';
import MotionFollowerBackground from './MotionFollowerBackground.jsx';
 
// App component - represents the whole app
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chosen:this.getMarkers()[0],
    }
  }


  getMarkers() {
    return [
      {name:'Blacks',src:"/images/blacks.jpg",index:0,spot_id:229},
      {name:'Sunset Cliffs',src:"/images/sunset-cliffs.jpg",index:1,spot_id:224},
      {name:'Pacific Beach',src:"/images/pacific_beach.jpg",index:2,spot_id:226},
      {name:'La Jolla Shores',src:"/images/la_jolla_shores.jpg",index:3,spot_id:755},
    ];
  }


  componentDidMount() {
    if (window.DeviceMotionEvent){
      window.addEventListener('deviceorientation', this.handleDeviceMotion.bind(this), false);
    }

    //this.getMarkers().forEach(this.requestService)
    
  }

  requestService(elem,index){

    this.serverRequest = $.get(App.statics.surf_api_url+'/'+elem.spot_id, function (result) {
      console.log(result);
    }.bind(this));
  }

  componentWillUnmount () {
    window.removeEventListener('deviceorientation', this.handleDeviceMotion, false);
  }

  handleDeviceMotion(event) {
    this.setData(event.alpha);
  }

  setData(alpha) {
    const index = Math.floor(alpha/(360/this.getMarkers().length));
    if(this.state.chosen.index !== index){
      this.setState({chosen:this.getMarkers()[index]});
    }
  }

  render() {
    return (
      <div className="container">
        <div id="beach_name">{this.state.chosen.name}</div>
        <header>
          <h1>Beaches</h1>
        </header>
        <MotionFollowerBackground image={this.state.chosen.src}/>
        <Compass markers={this.getMarkers()}/>
      </div>
    );
  }
}

App.statics = {
  surf_api_url:'http://api.spitcast.com/api/spot/forecast/'
}