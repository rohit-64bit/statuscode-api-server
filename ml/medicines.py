import requests
from dotenv import load_dotenv
import os
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

disease_name="fever"
patient_data="35 yr old male, with 45 Kg Weight"
input1="I am a " + patient_data+ ". I have  "+ disease_name + ". Give me the medicine name and for every medicine,give the medicine name, dosage freqeuency and confidence score, where the confidence score means how appropriate the medicine is for the user. express the confidence as percentage. in any case the answer should be enclosed within $$ and ##."
output = query({
	"inputs" : input1,
	"parameters":{}
})
##print(output[0]['generated_text'])
try:
	medicines= output[0]['generated_text']
except:
	medicines="Sorry, you should see a specialist as the treatment varies on other factors too"
print(medicines)