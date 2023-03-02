package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/smtp"
)

func sendMail(data map[string]string) (err error) {
	auth := smtp.PlainAuth("", data["username"], data["password"], data["hostname"])
	contentType := "Content-Type : text/html; charset=UTF-8"
	s := fmt.Sprintf("To:%s\r\nFrom:%s<%s>\r\nSubject:%s\r\n%s\r\n\r\n%s",
		data["to"], data["from"], data["username"], data["subject"], contentType, data["content"])
	msg := []byte(s)
	addr := fmt.Sprintf("%s:%d", data["hostname"], 25)
	err = smtp.SendMail(addr, auth, data["username"], []string{data["to"]}, msg)
	return
}

func send(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	formData := make(map[string]string)
	json.NewDecoder(r.Body).Decode(&formData)
	//fmt.Println(formData["content"])
	if err := sendMail(formData); err != nil {
		fmt.Printf("Send to %s Failed!\n", formData["to"])
		w.Write([]byte(err.Error()))
	} else {
		fmt.Printf("Send to %s Succeeded!\n", formData["to"])
		w.Write([]byte("OK"))
	}
}

func main() {
	fs := http.FileServer(http.Dir("static/"))
	http.Handle("/", fs)
	http.HandleFunc("/send", send)

	fmt.Printf("Open a browser : http://127.0.0.1:8080\n")

	http.ListenAndServe(":8080", nil)
}
