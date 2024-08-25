This model is designed for the classification of skin cancer images into various categories including benign keratosis-like lesions, basal cell carcinoma, actinic keratoses, vascular lesions, melanocytic nevi, melanoma, and dermatofibroma.

# USAGE:
```
python skin.py <path to input image>
```
The prediction will be printed on terminal and will be saved on a file calles skin_prediction.txt
# Model Overview
Model Architecture: Vision Transformer (ViT)

Pre-trained Model: Google's ViT with 16x16 patch size and trained on ImageNet21k dataset

Modified Classification Head: The classification head has been replaced to adapt the model to the skin cancer classification task.

Dataset Name: Skin Cancer Dataset
Source: Marmal88's Skin Cancer Dataset on Hugging Face

Classes: Benign keratosis-like lesions, Basal cell carcinoma, Actinic keratoses, Vascular lesions, Melanocytic nevi, Melanoma, Dermatofibroma
Training

Optimizer: Adam optimizer with a learning rate of 1e-4

Loss Function: Cross-Entropy Loss

Batch Size: 32

Number of Epochs: 5