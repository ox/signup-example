# Example React Signup Page

I made this as an experiment to try out React. It's a text box with a submit
button, and an agreement checkbox. The button only works if the checkbox is
checked. If the email field is empty or doesn't contain an "@" symbol, the POST
request fails. If it is "valid", the POST request succeeds. For both outcomes a
ResultModal shows up (just a paragraph tag for now) with the status and even a
server error response if it exists.

# Setup

The server is written in Go, and thus Go should be installed. If you want to
change the app in `/src/app.js`, install the react-tools from npm.

    $ brew install go node
    $ npm install -g react-tools

# Running

Run the `server.go` script with

    $ go run server.go

Then view the page at [localhost:8080](localhost:8080).

# JSX

To transform the JSX, run

    $ jsx --watch src/ assets/js

In the root of the source tree. It will automagically compile all of the JSX in
the `src` directory.

Alternatively, import the `JSXTransformer.js` script in `/assets/js/react/` into
the `index.html`.
