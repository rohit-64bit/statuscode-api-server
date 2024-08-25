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
input1=("I am " + user_data + ", I have the disease : " + symptoms + " based on these diseases, what are the immediate measures I should take in order to reduce the pain and prevent it from worsening further. do not suggest any kind of medications. The answer should be enclosed within $$ and ##")
output = query({
	"inputs" : input1,
	"parameters":{}
})
try:
	possible_diseases= output[0]['generated_text'].split("$$")[5].split("##")[0]
except:
	possible_diseases="Nothing you can do now, take care and Consult a specialist ASAP"

d= {'solutions' : possible_diseases.split("\n")[1:]}
print(d)


