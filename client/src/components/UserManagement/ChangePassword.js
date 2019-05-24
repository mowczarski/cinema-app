import React, { Component } from "react";
import firebase from "../../config/firebaseConfig";
import { Redirect } from "react-router-dom";
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: "",
      newPassword: "",
      passwordColor: "",
      errorPassword: null
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleFocusPassword = () => {
    this.setState({ passwordColor: "#d1d1fa" });
  };

  reauthenticate = currentPassword => {
    let user = firebase.auth().currentUser;
    let cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateAndRetrieveDataWithCredential(cred);
  };

  changePassword = () => {
    this.reauthenticate(this.state.currentPassword)
      .then(() => {
        let user = firebase.auth().currentUser;
        user
          .updatePassword(this.state.newPassword)
          .then(error => {
            this.setState({ errorPassword: `Password has been changed` });
          })
          .catch(error => {
            this.setState({ errorPassword: error.message });
          });
      })
      .catch(error => {
        this.setState({ errorPassword: error.message });
      });
  };

  render() {
    console.log(firebase.auth().currentUser);
    if (this.state.errorPassword === "Password has been changed") {
      return <Redirect to="/repertoire" />;
    }
    return (
      <div className="container-fluid bg-light py-3">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card card-body">
              <div
                className="text-center "
                style={{
                  marginTop: "5px",
                  marginBottom: "13px",
                  fontSize: "2rem"
                }}
              >
                Change your password
              </div>
              <div className="form-group has-success">
                <input
                  className="form-control input-lg"
                  type="password"
                  placeholder="Current Password"
                  name="currentPassword"
                  value={this.state.currentPassword}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group has-success">
                <input
                  className="form-control input-lg"
                  type="password"
                  placeholder="New Password"
                  name="newPassword"
                  value={this.state.newPassword}
                  onChange={this.handleChange}
                />
              </div>
              <button
                className="btn btn-lg btn-outline-light"
                onClick={this.changePassword}
                style={{
                  backgroundColor: "#7070EF",
                  marginLeft: "5px",
                  marginBottom: "5px",
                  border: "none",
                  marginTop: "5px",
                  fontWeight: "bold"
                }}
              >
                Submit
              </button>
              <h5
                style={{
                  color: "blue",
                  fontWeight: "bold",
                  marginTop: "10px"
                }}
              >
                {this.state.errorPassword}
              </h5>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChangePassword;
