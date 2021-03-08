import "./App.css";
import Navigation from "./components/navigation/Navigation";
import Logo from "./components/logo/logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import Particles from "react-particles-js";
import React from "react";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";


const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

const initialState = {
  
    userInput: "",
    imageUrl: "",
    box: {},
    route: "signIn",
    isSignedIn: false,
    user: {
      id: "",
      name: "",
      email: "",
      entries: 0,
      joined: ''
  }
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userInput: "",
      imageUrl: "",
      box: {},
      route: "signIn",
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: ''
      },
    };
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };


  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    }});
  }

  onSignOut = () => {
    this.setState({ route: "signIn" });
  };

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState (initialState)
    } else if (route === 'home'){
      this.setState ({isSignedIn: true})
    }
    this.setState({ route: route });
  };

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };

  onInputChange = (e) => {
    this.setState({ userInput: e.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.userInput });

    fetch("https://warm-plains-78126.herokuapp.com/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.userInput,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        fetch("https://warm-plains-78126.herokuapp.com/image", {
          method: "put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: this.state.user.id,
          }),
        })
          .then((response) => response.json())
          .then((count) => {
            this.setState(Object.assign(this.state.user, { entries: count }));
            this.displayFaceBox(this.calculateFaceLocation(response));
          })
          .catch(console.log);
      })
      .catch((err) => console.log(err));
  };

  render() {
    const {isSignedIn, imageUrl, route, box,user } = this.state;
    const {name,entries} = user;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank name={name} entries={entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              imageUrl={imageUrl}
              box={box}
            />
          </div>
        ) : route === "signIn" ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
