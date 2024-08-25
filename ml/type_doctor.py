import requests
from dotenv import load_dotenv
import os
import sys

user_data=sys.argv[1]
symptoms = sys.argv[2]

load_dotenv()

API_URL = os.getenv('APP_URI')
headers = {
	"Accept" : "application/json",
	"Authorization": "Bearer " + os.getenv("HF_ACCESS_TOKEN"),
	"Content-Type": "application/json"
}
def query(payload):
	response = requests.post(API_URL, headers=headers, json=payload)
	return response.json()

## symptoms="yellow eyes and yellow skin"
input1=("I am " + user_data + ", I have the following symptoms: " + symptoms + " based on these symptoms, what kind of doctor should I consult. Return the type of specialist doctor as plain text.give the answer enclosed within $$ and ##")
output = query({
	"inputs" : input1,
	"parameters":{}
})
try:
	possible_diseases= output[0]['generated_text'].split("$$")[2].split("##")[0]
except:
	print(output)
	possible_diseases="General Physician, More details from his side"

print({'suggested_specialist':possible_diseases})
