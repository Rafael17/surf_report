import React, { Component } from 'react';
 
import Compass from './Compass.jsx';
import MotionFollowerBackground from './MotionFollowerBackground.jsx';
 
// App component - represents the whole app
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chosen:this.getMarkers()[0],
      ax:[],
      shake_capturing:false
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


  // Currently every component has its onw device motion listener. 
  // This should be improved to only listen in the parent component and pass it down to the childern.
  componentDidMount() {
    if (window.DeviceMotionEvent){
      window.addEventListener('deviceorientation', this.handleDeviceOrientation.bind(this), false);
      window.addEventListener('devicemotion', this.handleDeviceMotion.bind(this), false);
    }
    this.getMarkers().forEach(this.requestService)
    
  }

  requestService(elem,index){

    this.serverRequest = $.get(App.statics.surf_api_url+'/'+elem.spot_id, function (result) {
      console.log(result);
    }.bind(this));
  }

  componentWillUnmount () {
    window.removeEventListener('deviceorientation', this.handleDeviceOrientation, false);
  }




  // Capturing shake gesture (fast acceleration on x each way within n seconds of eachother)
  handleDeviceMotion (event) {
    const ax = event.acceleration.x;
    let that = this;
    const threshold = 5;
    const time = 1000;

    if((ax>threshold||ax<(-1)*threshold) && this.state.shake_capturing === false){
      this.setState({shake_capturing:true})
      setTimeout(that.capturedGesture.bind(that),time)
    }
    if(this.state.shake_capturing === true && (ax>threshold||ax<(-1)*threshold)){
      let test = this.state.ax;
      test.push(ax);
      this.setState({ax:test});
    }
  }

  capturedGesture () {
    
    // Need to know which way we are moving first
    let dir = 0;
    if(this.state.ax[0]>0){
      dir=1;
    }

    let total = this.state.ax.reduce((total,num,index) =>{
      if(total%2 === 0 && num<0)
        return ++total;
      else if(total%2 === 1 && num>0)
        return ++total;
      else
        return total;
    },0)
    
    if((total+dir)>2){
      alert("Bake n Shake!");
    }
    this.setState({ax:[]});
    this.setState({shake_capturing:false})
  }

  handleDeviceOrientation(event) {
    this.setState({alpha:event.alpha})

    const index = Math.floor(event.alpha/(360/this.getMarkers().length));
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
        <Compass alpha={this.state.alpha} markers={this.getMarkers()}/>
      </div>
    );
  }
}

App.statics = {
  surf_api_url:'http://api.spitcast.com/api/spot/forecast/'
}