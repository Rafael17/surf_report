import React, { Component } from 'react';
 
import Compass from './Compass.jsx';
import MotionFollowerBackground from './MotionFollowerBackground.jsx';
 
// App component - represents the whole app
export default class App extends Component {

  constructor(props) {
    super(props);
    var markers = [
      {name:'Blacks',src:"/images/blacks.jpg",index:0,spot_id:229},
      {name:'Sunset Cliffs',src:"/images/sunset-cliffs.jpg",index:1,spot_id:224},
      {name:'Pacific Beach',src:"/images/pacific_beach.jpg",index:2,spot_id:226},
      {name:'La Jolla Shores',src:"/images/la_jolla_shores.jpg",index:3,spot_id:228},
      {name:'Ocean Beach Pier',src:"/images/ocean_beach.jpg",index:4,spot_id:225},
      {name:'Mission Beach',src:"/images/mission_beach.jpg",index:5,spot_id:397},
    ];
    var m = markers.map((elem,index) => {
      elem.wave = '';
      elem.condition = '';
      return elem;
    })
    this.state = {
      chosen:markers[0],
      markers:markers,
      ax:[],
      shake_capturing:false
    }
  }


  // Currently every component has its onw device motion listener. 
  // This should be improved to only listen in the parent component and pass it down to the childern.
  componentDidMount() {
    if (window.DeviceMotionEvent){
      window.addEventListener('deviceorientation', this.handleDeviceOrientation.bind(this), false);
      window.addEventListener('devicemotion', this.handleDeviceMotion.bind(this), false);
    }
    this.state.markers.forEach(this.requestService.bind(this))
    
  }

  requestService(elem,index){
    // Using yahoo api to bypass CORS from spitcast
    var query = encodeURI("select * from html where url='http://api.spitcast.com/api/spot/forecast/"+elem.spot_id)+"'";
    var yql = "https://query.yahooapis.com/v1/public/yql?q=";
    var params = "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    var url = yql+query+params;
    this.serverRequest = $.get(url, function(response){this.serviceCallback(index,response)}.bind(this));
  }

  serviceCallback(index,result) {
    var d = new Date();
    var hour = d.getHours();
    
    if(result.query.results){
      var body = JSON.parse(result.query.results.body);
      var markers = this.state.markers;
      
      markers[index].wave = Math.ceil(body[hour].size_ft * 100) / 100;
      markers[index].condition = body[hour].shape_full;
      this.setState({
        markers:markers
      })
    }
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
      alert("Shake and Bake!");
    }
    this.setState({ax:[]});
    this.setState({shake_capturing:false})
  }

  handleDeviceOrientation(event) {
    this.setState({alpha:event.alpha})

    const index = Math.floor(event.alpha/(360/this.state.markers.length));
    if(this.state.chosen.index !== index){
      this.setState({chosen:this.state.markers[index]});
    }
  }

  render() {
    return (
      <div className="container">
        <div id="beach_name">{this.state.chosen.name}
          <br/>Wave Size: {this.state.chosen.wave}
          <br/>Conditions: {this.state.chosen.condition}</div>
        <header>
          <h1>Beaches</h1>
        </header>
        <MotionFollowerBackground image={this.state.chosen.src}/>
        <Compass alpha={this.state.alpha} markers={this.state.markers}/>
      </div>
    );
  }
}

App.statics = {
  surf_api_url:'http://api.spitcast.com/api/spot/forecast/'
}