#%%
# Load Necessary libraries
import os
from PIL import Image
import torch
import torchvision

#%%
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

#%%
MODEL_SAVE_PATH = 'checkpoints/'
model = torchvision.models.resnet152(pretrained=True).to(device)

#%%
# model.load_state_dict(torch.load(os.path.join(MODEL_SAVE_PATH, 'best_checkpoint.pth')))

state_dict = torch.load(os.path.join(MODEL_SAVE_PATH, 'best_checkpoint.pth'))
state_dict = {k.replace("fc.", ""): v for k, v in state_dict.items()}
model.load_state_dict(state_dict)

model.eval()

#%%
image_path = 'data/cat_12.jpg'
image = Image.open(image_path)
transform = torchvision.transforms.Compose([
    torchvision.transforms.Resize(256),
    torchvision.transforms.CenterCrop(224),
    torchvision.transforms.ToTensor(),
    torchvision.transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))
])
preprocessed_image = transform(image).unsqueeze(0).to(device)

with torch.no_grad():
    predictions = model(preprocessed_image)

predicted_class = torch.argmax(predictions).item()
print(predicted_class)

class_labels = ['Abyssinian', 'Bengal', 'Birman', 'Bombay', 'British Shorthair', 'Egyptian Mau', 'Maine Coon', 'Persian', 'Ragdoll', 'Russian Blue', 'Siamese', 'Sphynx'] 
predicted_label = class_labels[predicted_class]
print(f'Predicted class: {predicted_label}')

# 9/12