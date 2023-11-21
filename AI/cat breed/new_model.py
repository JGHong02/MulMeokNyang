# Load Necessary libraries
import os
import torch
import torchvision
from torchvision.models import resnet152, resnet50
from torchvision.transforms import RandomApply, RandomRotation, RandomPerspective, Resize, CenterCrop, ToTensor, Normalize
from sklearn.metrics import classification_report, f1_score

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

transform_rotation = RandomApply([
    RandomRotation(20)
], p=0.2)

transform_train = torchvision.transforms.Compose([
    Resize(256),
    CenterCrop(224),
    RandomPerspective(distortion_scale=0.1, p=0.2),
    transform_rotation,
    ToTensor(),
    Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))
])

transform_valid = torchvision.transforms.Compose([
    Resize(256),
    CenterCrop(224),
    ToTensor(),
    Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))
])

# Load Data
TRAIN_DATA_DIR = 'data/train'
VALID_DATA_DIR = 'data/val'
TEST_DATA_DIR = 'data/test'

BATCH_SIZE = 32

train_data = torchvision.datasets.ImageFolder(TRAIN_DATA_DIR,
                                              transform=transform_train,
                                              is_valid_file=lambda x: x.endswith('.jpg'))

valid_data = torchvision.datasets.ImageFolder(VALID_DATA_DIR,
                                              transform=transform_valid,
                                              is_valid_file=lambda x: x.endswith('.jpg'))

test_data = torchvision.datasets.ImageFolder(TEST_DATA_DIR,
                                             transform=transform_valid,
                                             is_valid_file=lambda x: x.endswith('.jpg'))

train_loader = torch.utils.data.DataLoader(train_data, batch_size=BATCH_SIZE, num_workers=2, shuffle=True)
val_loader = torch.utils.data.DataLoader(valid_data, batch_size=BATCH_SIZE, num_workers=2)
dataloaders_dict = {'train': train_loader, 'val': val_loader}

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

MODEL_SAVE_PATH = 'checkpoints'
LEARNING_RATE = 1e-3
N_EPOCHS = 35

def train(model, n_epochs, criterion, optimizer, train_data_loader, valid_data_loader,
          device, model_save_path, logging_interval: int = 50):
    # ...
    return 

if __name__ == '__main__':
    # ...
    
    # Use ViT model
    model = torchvision.models.vit_base_patch16_224(pretrained=True)
    model.head = ModelHead(768, 512, 12)  # Adjust the head according to your needs
    model.to(device)

    criterion = torch.nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=LEARNING_RATE)

    train(model, N_EPOCHS, criterion, optimizer,
          train_data_loader, valid_data_loader,
          device, MODEL_SAVE_PATH)
    
    # ...
