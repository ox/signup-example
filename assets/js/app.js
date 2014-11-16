var EmailBar = React.createClass({displayName: 'EmailBar',
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
      React.createElement("form", {onSubmit: this.handleSubmit}, 
        React.createElement("input", {
          type: "text", 
          ref: "emailTextInput", 
          placeholder: "Enter your email"}
        ), 
        React.createElement("input", {
          type: "submit", 
          value: "sign me up", 
          disabled: !this.state.agreedToTerms}
        ), React.createElement("br", null), 
        React.createElement("p", null, 
          React.createElement("input", {
            type: "checkbox", 
            ref: "acceptanceCheckbox", 
            defaultChecked: this.state.agreedToTerms, 
            onChange: this.handleCheckboxChange}
          ), 
          "I agree to all the stuff."
        )
      )
    );
  }
});

var ResultModal = React.createClass({displayName: 'ResultModal',
  render: function () {
    var style = {"display": this.props.show ? "block" : "none"};

    var message = "Your email was added successfully! We'll keep you posted!";
    if (!this.props.succeeded) {
      message = "Something went wrong. Try again! Reason: " + this.props.serverResponse;
    }

    return (
      React.createElement("div", {class: "modal", style: style}, 
        React.createElement("p", null, 
          React.createElement("input", {type: "button", onClick: this.props.handleClose, value: "x"}), 
          message
        )
      )
    );
  }
});

var SignUpForm = React.createClass({displayName: 'SignUpForm',
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
      React.createElement("div", null, 
        React.createElement(EmailBar, {
          agreedToTerms: this.state.agreedToTerms, 
          handleSubmit: this.handleSubmit}), 
        React.createElement(ResultModal, {
          show: this.state.showResultModal, 
          succeeded: this.state.signupSucceeded, 
          serverResponse: this.state.serverResponse, 
          handleClose: this.handleClose})
      )
    );
  }
});

React.render( React.createElement(SignUpForm, null) , document.body);
