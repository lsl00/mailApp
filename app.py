from flask import Flask,request,redirect
from email.mime.text import MIMEText
import smtplib,ssl
from time import sleep

def sendmail(j):
	msg = MIMEText(j['content'],'html','utf-8')
	msg['Subject'] = j['subject']
	msg['From'] = j['from']
	
	smtpObj = smtplib.SMTP(j['hostname'],25)

	smtpObj.login(j['username'],j['password'])
	smtpObj.sendmail(j['username'],j['to'],msg.as_string())
	smtpObj.quit()
	


app = Flask(__name__)

@app.route("/send",methods=['POST'])
def send():
	#print(request.json)
	try:
		sleep(0.005)
		sendmail(request.json)
	except smtplib.SMTPException as e:
		print("Error")
		return e.__str__()
	else :
		print("No problem")
		return "true"

@app.route("/<p>")
def red(p):
	return redirect("/static/{}".format(p))

@app.route('/')
def index():
	return redirect("/index.html")

print("Open http://127.0.0.1:5000")
if __name__ == '__main__':
	app.run()
