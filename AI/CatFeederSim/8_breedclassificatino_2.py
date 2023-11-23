#%%
# Load Necessary libraries
import os
from PIL import Image
import torch
import torchvision
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, f1_score
from torchvision.models import resnet50, ResNet50_Weights
import pandas as pd

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
image_extensions = ['.jpg', '.jpeg', '.png', '.bmp']
dir_path = './photosForAI/Cat/spaceId_123194564'

transform_rotation = torchvision.transforms.RandomApply([
    torchvision.transforms.RandomRotation(20)
], p=0.2)

class ModelHead(torch.nn.Module):
    def __init__(self, input_dim, hidden_dim, n_classes):
        super(ModelHead, self).__init__()
        self.fc1 = torch.nn.Linear(input_dim, hidden_dim)
        self.relu1 = torch.nn.ReLU()
        self.fc2 = torch.nn.Linear(hidden_dim, hidden_dim // 2)
        self.relu2 = torch.nn.ReLU()
        self.fc3 = torch.nn.Linear(hidden_dim // 2, n_classes)

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu1(x)
        x = self.fc2(x)
        x = self.relu2(x)
        x = self.fc3(x)
        return x

MODEL_SAVE_PATH = './checkpoints'

#%%
if __name__ == '__main__':
    print(f'Using device: {device}.')

    model = resnet50(weights=ResNet50_Weights.DEFAULT).to(device)
    for parameter in model.parameters():
        parameter.requires_grad = False
    
    model.fc = ModelHead(2048, 1024, 12)
    model.fc.to(device)

    model.load_state_dict(torch.load(os.path.join(MODEL_SAVE_PATH, 'best_checkpoint.pth')))
    model.eval()

    num_of_cats = len(next(os.walk(dir_path))[1])

    for i in range(num_of_cats):
        img_path = dir_path + f"/catId_{i + 1}/photosForAI/"
        imgs_list = [filename for filename in os.listdir(img_path) if os.path.splitext(filename)[-1] in image_extensions]

        df_id = pd.read_csv(dir_path + f"/catId_{i + 1}/predict/labels/Id_{i + 1}.csv", sep=' ', header=0, names=['class', 'file_name', 'color1', 'color2', 'color3', 'color4', 'color5'])
        print(df_id.head(10))

        for img in imgs_list:
            image = Image.open(os.path.join(img_path, img))

            img_num = img[6:].replace('.jpg', "")
            print(img_num)

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

            df_id.loc[df_id[df_id["file_name"] == img].index.tolist(), "breed"] = predicted_label
            print(df_id.loc[df_id["file_name"] == img])

                  
        df_id.to_csv(dir_path + f"/catId_{i + 1}/predict/labels/Id_{i + 1}.csv", sep=' ', header=True, index=False)

    # 9/12
# resnet 152 => 6/12
# resnet 50 => 9/12