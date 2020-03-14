import React, { Component } from "react";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import SignIn from "./components/SignIn/SignIn";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Register from "./components/Register/Register";
import "./App.css";

const app = new Clarifai.App({
  apiKey: "e153573104b743a8aa888a5e15cbd1e5"
});

const particlesConfig = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imgURL: "",
      box: {},
      route: "signin",
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: ""
      }
    };
  }

  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  };

  calculateFaceLocation = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  };

  displayFaceBox = box => {
    console.log(box);
    this.setState({
      box: box
    });
  };

  onInputChange = event => {
    this.setState({
      input: event.target.value
    });
  };

  onPictureSubmit = () => {
    const { input } = this.state;

    this.setState({
      imageUrl: input
    });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, input)
      .then(response => {
        if (response) {
          fetch("http://localhost:3001/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => Object.assign(this.state.user, { entries: count }));
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(err => console.log(err));
  };

  onRouteChange = route => {
    if (route === "signout") {
      this.setState({ isSignedIn: false });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, box, imageUrl, route } = this.state;
    const { name, entries } = this.state.user;
    const homeRoute = (
      <>
        <Logo />
        <Rank name={name} entries={entries} />
        <ImageLinkForm
          inputChange={this.onInputChange}
          onPictureSubmit={this.onPictureSubmit}
        />
        <FaceRecognition box={box} url={imageUrl} />
      </>
    );
    const otherRoutes =
      route === "signin" ? (
        <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
      ) : (
        <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
      );

    return (
      <div className="App">
        <Particles params={particlesConfig} className="particles" />
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={isSignedIn}
        />
        {route === "home" ? homeRoute : otherRoutes}
      </div>
    );
  }
}

export default App;
