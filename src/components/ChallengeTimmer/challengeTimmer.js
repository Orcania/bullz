import React from "react";

import Countdown from "react-countdown";

let dayLeft;
function setDate(endTime) {
  var launchDate = new Date(endTime).toUTCString();
  var currDate = new Date();
  let daysDiff =
    (new Date(launchDate).getTime() - currDate.getTime()) /
    (1000 * 60 * 60 * 24);
  let hoursDiff = (daysDiff - parseInt(daysDiff)) * 24;
  let minDiff = (hoursDiff - parseInt(hoursDiff)) * 60;
  let secDiff = (minDiff - parseInt(minDiff)) * 60;
  let milisec = (secDiff - parseInt(secDiff)) * 1000;
  const daysLeft = parseInt(daysDiff) * 24 * 60 * 60 * 1000;
  const hourLeft = parseInt(hoursDiff) * 60 * 60 * 1000;
  const minLeft = parseInt(minDiff) * 60 * 1000;
  const secLeft = parseInt(secDiff) * 1000;
  dayLeft = daysLeft + hourLeft + minLeft + secLeft + milisec;
}

class ChallengeCountDown extends React.PureComponent {
  constructor(props) {
    super(props);
    setDate(this.props.auctionETime);
    this.state = {
      counter: 0,
    };
    this.intervalId = "";
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      setDate(this.props.auctionETime);
      this.setState({ counter: this.state.counter + 1 });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <React.Fragment>
        <>
          <Countdown
            date={new Date().getTime() + dayLeft}
            renderer={renderer}
          />
        </>
      </React.Fragment>
    );
  }
}

const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return (
      <div className="timer">
        <div className="timer-item">
          <p>00</p> <span>Day</span>
        </div>
        <div className="timer-item">
          <p>00</p> <span>Hours</span>
        </div>
        <div className="timer-item">
          <p>00</p> <span>Minutes</span>
        </div>
        <div className="timer-item">
          <p>00</p> <span>Seconds</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="timer">
        <div className="timer-item">
          <p>{days}</p> <span>Day</span>
        </div>
        <div className="timer-item">
          <p>{hours >= 10 ? hours : "0" + hours}</p> <span>Hours</span>
        </div>
        <div className="timer-item">
          <p>{minutes >= 10 ? minutes : "0" + minutes}</p> <span>Minutes</span>
        </div>
        <div className="timer-item">
          <p>{seconds >= 10 ? seconds : "0" + seconds}</p> <span>Seconds</span>
        </div>
      </div>
    );
  }
};

export default ChallengeCountDown;
