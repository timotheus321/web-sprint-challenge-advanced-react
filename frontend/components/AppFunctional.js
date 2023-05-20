import React, { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const y = Math.floor(index /3) + 1;
    const x = (index % 3) + 1;
    return { x, y};
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    
      let newIndex = index;
  
      switch (direction) {
          case 'left':
              if (index % 3 !== 0) { // Not on the leftmost column
                  newIndex = index - 1;
              }
              break;
          case 'right':
              if (initialIndex % 3 !== 2) { // Not on the rightmost column
                  newIndex = index + 1;
              }
              break;
          case 'up':
              if (index >= 3) { // Not on the topmost row
                  newIndex = index - 3;
              }
              break;
          case 'down':
              if (index < 6) { // Not on the bottommost row
                  newIndex = index + 3;
              }
              break;
          default:
              break;
      }
  
      return newIndex;
  }
  
  

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    let direction = evt.target.id;
    let newIndex = getNextIndex(direction);
    setIndex(newIndex)
    setSteps(steps + 1)
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    
    setEmail(evt.target.value);
  }

 
//   function onSubmit(evt) {
//     // Use a POST request to send a payload to the server.
//     evt.preventDefault();

//     const payload ={
//       x: getXY().x,
//       y: getXY().y,
//       steps: steps,
//       email: email
//     }
//     fetch('http://localhost:9000/api/result', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(payload)
//     })
//     .then(response => {
//       if (!response.ok) {
//         if (response.status === 422) {
//           // You can handle 422 Unprocessable Entity here
//           // For instance, you can set a state that will show a message to the user
//           setMessage('There was an error processing your request. Please check your inputs and try again.');
//         } else {
//           throw new Error(`HTTP error, status = ${response.status}`);
//         }
//       }
//       return response.json();
//     })
//     .then(data => console.log(data))
//     .catch((error) => {
//       console.error('Error:', error);
//     })
// }
function onSubmit(evt) {
  evt.preventDefault();

  const payload ={
    x: getXY().x,
    y: getXY().y,
    steps: steps,
    email: email
  }

  // Check if payload is empty
  const isEmpty = Object.values(payload).every(x => (x === null || x === ''));

  if(isEmpty) {
    setMessage('Please fill out all fields before submitting');
    return;
  }

  fetch('http://localhost:9000/api/result', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 422) {
        setMessage('There was an error processing your request. Please check your inputs and try again.');
      } else {
        throw new Error(`HTTP error, status = ${response.status}`);
      }
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch((error) => {
    console.error('Error:', error);
  })
}



  
  
  
  
  

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email}  onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
