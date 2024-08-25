import requests
from dotenv import load_dotenv
import os
import sys

symptoms = sys.argv[1]

load_dotenv()

API_URL = os.getenv('APP_URI')
headers = {
	"Accept" : "application/json",
	"Authorization": "Bearer "+os.getenv("HF_ACCESS_TOKEN"),
	"Content-Type": "application/json"
}
def query(payload):
	response = requests.post(API_URL, headers=headers, json=payload)
	return response.json()

## symptoms="yellow eyes and yellow skin"
input1=("I am having the following symptoms :" + str(symptoms) + " . What are the possible diseases or problems I have. return the answer as Answer: , in a new line    . Dont return anything else. return atmost 5 most probable diseases and end the answer with $$")
output = query({
	"inputs" : input1,
	"parameters":{}
})
try:
	possible_diseases= output[0]['generated_text'].split("Answer:")[3].split("$$")[0]
except:
	##print(output[0]['generated_text'])
	try:
		possible_diseases = output[0]['generated_text'].split("Output:")[3].split("$$")[0]
	except:
		possible_diseases = "Minor things, should get better in a few days, otherwise consult a specialist"
print({'possible_diseases':possible_diseases.split("\n")[1:]})