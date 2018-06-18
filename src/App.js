import React, { Component } from 'react';
import './App.css';
import {Navigation} from './components/Navigation/Navigation.js';
import {Logo} from './components/Logo/Logo.js';
import {ImageLinkForm} from './components/ImageLinkForm/ImageLinkForm.js';
import {FaceRecognition} from './components/FaceRecognition/FaceRecognition.js';
import {Rank} from './components/Rank/Rank.js';
import {Signin} from './components/Signin/Signin';
import {Register} from './components/Register/Register';
import Particles from 'react-particles-js';
import 'tachyons';
import {API_URL} from './api';



const particleOptions = {
  particles: {
    number: {
      value: 20,
      density: {
        enable: true,
        value_area: 800
      }
    },
    // line_linked: {
    //   shadow: {
    //     enable: true,
    //     color: "#3CA9D1",
    //     blur: 5
    //   }
    // }
  }
};

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    email: '',
    id: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        email: '',
        id: '',
        entries: 0,
        joined: ''
      }
    }
  }

  // componentDidMount() {
  //   fetch('http://localhost:5000')
  //     .then(response => response.json())
  //     .then(console.log)
  // }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width, height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
    
  }

  displayFaceBox = (box) => {
    // console.log(box);
    this.setState({box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route})
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch(`${API_URL}imageurl`, {           
      method: 'post',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          input: this.state.input
      })
    })
    .then(res => {
      return res.json()
    })
    .then( (response) => {
        // console.log(response);
        // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        if(response) {
          fetch(`${API_URL}image`, {           
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(res => {
            return res.json()
          })
          .then(count => {
            this.setState(Object.assign(this.state.user, {              
              entries: count
            }));
          })
          .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
    }).catch( err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particleOptions}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home' 
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onSubmit} />
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
            </div>
           : (
            this.state.route === 'signin' 
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
        }
      </div>
    );
  }
}

export default App;
