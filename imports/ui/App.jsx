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
      shake_capturing:false,
      allow_orientation:true
    }
  }

  

  componentDidMount() {
    if (window.DeviceMotionEvent){
      window.addEventListener('deviceorientation', this.handleDeviceOrientation.bind(this));
      window.addEventListener('devicemotion', this.handleDeviceMotion.bind(this));
    }else{
      alert("Device motion events not available. Please open this site from a mobile device");
    }
    this.state.markers.forEach(this.requestService.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('deviceorientation', this.handleDeviceOrientation.bind(this));
    window.removeEventListener('devicemotion', this.handleDeviceMotion.bind(this));
  }





  requestService(elem,index){
    // Using yahoo api to bypass CORS from spitcast
    var query = encodeURI("select * from html where url='http://api.spitcast.com/api/spot/forecast/"+elem.spot_id)+"'";
    var yql = "https://query.yahooapis.com/v1/public/yql?q=";
    var params = "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    var url = yql+query+params;
    $.get(url, function(response){this.serviceCallback(index,response)}.bind(this));
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

 







  
  handleDeviceMotion (event) {
    if(this.state.allow_orientation !== true){
      return;
    }
    this.shakeGesture(event.acceleration.x);
  }

  // Capturing shake gesture (fast acceleration $threshold on x each way within $time seconds of eachother)
  shakeGesture(ax) {
    const threshold = 5;
    const time = 1000;

    if((ax>threshold||ax<(-1)*threshold) && this.state.shake_capturing === false){
      this.setState({shake_capturing:true});
      this.setState({shake_dir:((ax>0)?1:-1)})
      setTimeout(this.capturingGesture.bind(this),time)
    }
    if(ax>threshold && this.state.shake_dir>0 && this.state.shake_capturing === true){
      this.setState({shook:true});
    }
    if(ax<threshold && this.state.shake_dir<0 && this.state.shake_capturing === true){
      this.setState({shook:true});
    }
  }

  capturingGesture() {
    if(this.state.shook === true){
      //window.removeEventListener('deviceorientation', this.handleDeviceOrientation);
      this.setState({allow_orientation:false});
      
      //Number btw 1-4
      let stop = ((Math.random()*10)%3+1)*1000;
      let counter = this.state.alpha;
      let id = setInterval(function(){
        counter=counter-4;
        if(counter<0){
          counter=360;
        }
        this.moveElements(counter%360).bind(this);
      }.bind(this),15);

      setTimeout(function(){
          clearInterval(id);
          setTimeout(function(){
            this.setState({allow_orientation:true})
          }.bind(this),2000);
      }.bind(this),stop);

    }
    this.setState({shake_capturing:false});
    this.setState({shake_dir:0});
  }


  handleDeviceOrientation(event) {
    //this.componentWillUnmount();
    //not able to remove any device event, instead:
    if(this.state.allow_orientation !== true){
      return;
    }
    this.moveElements(event.alpha);
  }

  moveElements(alpha) {
    this.setState({alpha:alpha})

    const index = Math.floor(alpha/(360/this.state.markers.length));
    if(this.state.chosen.index !== index){
      this.setState({chosen:this.state.markers[index]});
    }
  }

  render() {
    return (
      <div className="container">
        <div id="beach_stats">{this.state.chosen.name}
          <div>
            {((this.state.chosen.wave)?('Wave Size: '+this.state.chosen.wave):"")}
          </div>
          <div>
            {((this.state.chosen.wave)?('Conditions: '+this.state.chosen.condition):"")}
          </div>
        </div>
        <MotionFollowerBackground image={this.state.chosen.src}/>
        <Compass alpha={this.state.alpha} markers={this.state.markers}/>
      </div>
    );
  }
}

App.statics = {
  surf_api_url:'http://api.spitcast.com/api/spot/forecast/'
}