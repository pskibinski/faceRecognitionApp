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
      isSignedIn: false
    };
  }

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

  onButtonSubmit = () => {
    const { input } = this.state;

    this.setState({
      imageUrl: input
    });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, input)
      .then(response =>
        this.displayFaceBox(this.calculateFaceLocation(response))
      )
      .catch(err => console.log("error"));
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
    const homeRoute = (
      <>
        <Logo />
        <Rank />
        <ImageLinkForm
          inputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={box} url={imageUrl} />
      </>
    );
    const otherRoutes =
      route === "signin" ? (
        <SignIn onRouteChange={this.onRouteChange} />
      ) : (
        <Register onRouteChange={this.onRouteChange} />
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
