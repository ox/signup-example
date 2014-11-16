var EmailBar = React.createClass({
  getInitialState: function () {
    return { agreedToTerms: true };
  },

  handleSubmit: function (e) {
    e.preventDefault();
    this.props.handleSubmit(e.target.value);
  },

  handleCheckboxChange: function (e) {
    this.setState({ agreedToTerms: e.target.checked });
  },

  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          ref="emailTextInput"
          placeholder="Enter your email"
        />
        <input
          type="submit"
          value="sign me up"
          disabled={!this.state.agreedToTerms}
        /><br/>
        <p>
          <input
            type="checkbox"
            ref="acceptanceCheckbox"
            defaultChecked={this.state.agreedToTerms}
            onChange={this.handleCheckboxChange}
          />
          I agree to all the stuff.
        </p>
      </form>
    );
  }
});

var ResultModal = React.createClass({
  render: function () {
    var style = {"display": this.props.show ? "block" : "none"};

    var message = "Your email was added successfully! We'll keep you posted!";
    if (!this.props.succeeded) {
      message = "Something went wrong. Try again! Reason: " + this.props.serverResponse;
    }

    return (
      <div class="modal" style={style}>
        <p>
          <input type="button" onClick={this.props.handleClose} value="x" />
          {message}
        </p>
      </div>
    );
  }
});

var SignUpForm = React.createClass({
  getInitialState: function () {
    return {
      showResultModal: false,
      signupSucceeded: false,
      serverResponse: ''
    }
  },

  handleSubmit: function (emailAddress) {
    // Send this to the backend
    var request = new XMLHttpRequest();
    request.open('POST', '/email-signup', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    var success = function () {
      this.setState({
        showResultModal: true,
        signupSucceeded: true
      });
    }.bind(this);

    var failure = function (reason) {
      this.setState({
        showResultModal: true,
        signupSucceeded: false,
        serverResponse: reason
      });
    }.bind(this)

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        success();
      } else {
        failure(request.responseText);
      }
    };

    request.onerror = failure;
    request.send("email=" + encodeURIComponent(emailAddress));
  },

  handleClose: function () {
    this.setState({ showResultModal: false });
  },

  render: function () {
    return (
      <div>
        <EmailBar
          agreedToTerms={this.state.agreedToTerms}
          handleSubmit={this.handleSubmit} />
        <ResultModal
          show={this.state.showResultModal}
          succeeded={this.state.signupSucceeded}
          serverResponse={this.state.serverResponse}
          handleClose={this.handleClose} />
      </div>
    );
  }
});

React.render( < SignUpForm /> , document.body);
