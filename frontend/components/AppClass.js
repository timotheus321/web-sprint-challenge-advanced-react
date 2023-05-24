import React from 'react'
import axios from 'axios';
// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(props) {
    super(props);
    this.state = {
     message: '',
     email: '',
     steps: 0,
     index: 4
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.move = this.move.bind(this);
  }

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const y = Math.floor(this.state.index /3) + 1;
    const x = (this.state.index % 3) + 1;
    return {x, y};
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = this.getXY();
    return `Coordinates (${x}, ${y})`;
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({
      message: initialMessage,
      email: initialEmail,
      steps: initialSteps,
      index: initialIndex
    });
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let newIndex = this.state.index;

    switch (direction) {
      case 'left':
        if (this.state.index % 3 !== 0) {
          newIndex = this.state.index - 1;
        }
        break;
      case 'right':
        if (this.state.index % 3 !== 2) {
          newIndex = this.state.index + 1;
        }
        break;
      case 'up':
        if (this.state.index >= 3) {
          newIndex = this.state.index - 3;
        }
        break;
      case 'down':
        if (this.state.index < 6) {
          newIndex = this.state.index + 3;
        }
        break;
      default:
        break;
    }

    return newIndex;
  }
  

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    let direction = evt.target.id;
    let newIndex = this.getNextIndex(direction);
    let message = "";
    let steps = this.state.steps;
    if (newIndex !== this.state.index){
        steps += 1;}
     else { 
        message = `You can't go ${direction}`;
    }
    this.setState({
      index: newIndex,
      steps: steps,
      message: message
    });
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({
      email: evt.target.value
    });
  }


  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
  
    const payload = {
      x: this.getXY().x,
      y: this.getXY().y,
      steps: this.state.steps,
      email: this.state.email
    }
    
    // fetch('http://localhost:9000/api/result', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(payload)
    // })
    // .then(response => {
    //   // Check if the response is ok
    //   if (!response.ok) {
    //     // If not ok, throw an error
    //     throw new Error(`HTTP error, status = ${response.status}`);
    //   }
    //   return response.json();
    // })
    axios.post('http://localhost:9000/api/result', payload)
    .then(res => { 
     this.setState({message: res.data.message, email: ""})
    })
    .catch((error) => {
      //console.log('Error:', {error});
      this.setState({message: error.response.data.message});
    });
  }
  

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">{`You moved ${this.state.steps} ${this.state.steps === 1 ? 'time' : 'times'}`}</h3>

        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" onChange={this.onChange} value={this.state.email}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
