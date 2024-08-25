from transformers import pipeline
from transformers import AutoImageProcessor, AutoModelForImageClassification
import PIL.Image
import torch
import sys
pipe = pipeline("image-classification", model="Anwarkh1/Skin_Cancer-Image_Classification", device="cpu")
processor = AutoImageProcessor.from_pretrained("Anwarkh1/Skin_Cancer-Image_Classification")
model = AutoModelForImageClassification.from_pretrained("Anwarkh1/Skin_Cancer-Image_Classification")
if len(sys.argv) != 2:
    print("Usage: python your_script.py <image_path>")
    sys.exit(1)
image_path = sys.argv[1]
image = PIL.Image.open(image_path).convert("RGB")
inputs = processor(images=image, return_tensors="pt")
with torch.no_grad():
    outputs = model(**inputs)
predicted_class_id = outputs.logits.argmax().item()
predicted_class_name = model.config.id2label[predicted_class_id]

if(predicted_class_name == "melanocytic_Nevi"):
    prediction="Melanocytic Nevi/None"
else:
    prediction=predicted_class_name
with open("skin_prediction.txt", "w") as file:
    file.write(prediction)
print(prediction)