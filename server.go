package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"
)

func HandleSignup(w http.ResponseWriter, req *http.Request) {
	req.ParseForm()
	email := req.FormValue("email")
	if email == "" {
		log.Println("no email address provided")
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Email not provided.")
		return
	}

	if !strings.Contains(email, "@") {
		log.Printf("rejected %s, reason: Invalid email address\n", email)
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Invalid email address.")
		return
	}

	log.Println("accepted email:", email)
	fmt.Fprintf(w, "Email processed.")
}

func main() {
	http.Handle("/email-signup", http.HandlerFunc(HandleSignup))
	http.Handle("/", http.FileServer(http.Dir("./")))

	log.SetPrefix("[signup] ")
	log.Println("Running " + log.Prefix() + "service on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
