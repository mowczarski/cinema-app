import React, { Component } from "react";
import axios from "axios";
import "./style.css";
import { connect } from "react-redux";
import firebase from "../../config/firebaseConfig";

class Reservation extends Component {
  constructor() {
    super();
    this.state = {
      hall_movieId: "",
      hallID: "",
      movieID: "",
      seanceDate: "",
      seatsBooked: [],
      userSeats: []
    };
  }

  componentDidMount() {
    axios
      .get(
        `http://51.15.102.229:5000/api/seans/${
          this.props.match.params.movieApiId
        }`
      )
      .then(res => {
        console.log(res.data);
        const movie = res.data;
        const hallid = movie.hallID;
        const movieid = movie.movieID;
        console.log(movieid);
        this.setState({ hallID: hallid });
        //const movieID = res.data;
        this.setState({ movieID: movie.movieID });
        //const seanceDate = res.data;
        this.setState({ seanceDate: movie.seanceDate });
        axios
          .get(
            `http://51.15.102.229:5000/api/seatbooked/${
              this.props.match.params.movieApiId
            }`
          )
          .then(res => {
            const movie = res.data;
            console.log(movie);
            this.setState({ seatsBooked: movie });
          });
        // const seatsBooked = res.data;
      });
  }

  onclick = e => {
    let array = this.state.userSeats;
    if (array.includes(e.target.attributes.name.nodeValue.substring(1))) {
      array.splice(
        array.indexOf(e.target.attributes.name.nodeValue.substring(1)),
        1
      );
    }
    console.log(e.target.attributes.name.nodeValue);
    if (e.target.style.backgroundColor === "rgb(0, 255, 0)") {
      this.setState({
        [e.target.name]: (e.target.style.backgroundColor = "")
      });
    } else {
      array.push(String(e.target.attributes.name.nodeValue).substring(1));
      this.setState({
        [e.target.name]: (e.target.style.backgroundColor = "#00FF00"),
        userSeats: array.sort()
      });
    }
  };

  onSubmit = e => {
    e.preventDefault();
    const newReservationFire = {
      movieID: this.state.movieID,
      seanceDate: this.state.seanceDate,
      userSeats: this.state.userSeats,
      userUid: this.props.auth.uid,
      createdAt: new Date()
    };

    firebase
      .firestore()
      .collection("reservations")
      .add(newReservationFire);
  };

  render() {
    return (
      <div>
        {" "}
        <h1>
          <font color="silver">Book your ticket! </font>{" "}
        </h1>
        <div class="row justify-content-md-center">
          <div class="col col-lg-2" />
          <div class="col-md-auto">
            <div className="col-md-12">
              {this.state.seatsBooked === null ? null : (
                <table>
                  {[...Array(5)].map((x, i) => (
                    <tbody>
                      {[...Array(15)].map((x, no) => (
                        <th>
                          {this.state.seatsBooked.includes(
                            Number(String(i + 1) + String(no + 1))
                          ) ? (
                            <div
                              className="place"
                              style={{ backgroundColor: "red" }}
                              name={Number(`${i + 1}${no + 1}`)}
                            >
                              {no + 1}
                            </div>
                          ) : (
                            <div
                              className="place"
                              name={"a" + Number(`${i + 1}${no + 1}`)}
                              style={{
                                backgroundColor: this.state.a212
                              }}
                              onClick={this.onclick}
                            >
                              {no + 1}
                            </div>
                          )}
                        </th>
                      ))}
                    </tbody>
                  ))}
                </table>
              )}
            </div>
            <button
              className="btn btn-lg btn-outline-light mr-2"
              style={{
                backgroundColor: "#0051a5",
                fontwe: "bold",
                marginLeft: "5px",
                marginBottom: "5px",
                marginTop: "5px",
                border: "none"
              }}
              onClick={this.onSubmit}
            >
              Submit
            </button>
          </div>
          <div className="col col-lg-2" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth
  };
};

export default connect(mapStateToProps)(Reservation);
