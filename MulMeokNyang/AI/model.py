import os
import numpy as np
import cv2
from PIL import Image, ImageDraw
from ultralytics import YOLO
import torch
import torchvision
from torchvision.models import resnet50, ResNet50_Weights
from sklearn.cluster import KMeans
from skimage.color import rgb2lab
import webcolors

def return_Dominant_colors(cluster, C_centroids):
    # Calculate histogram of cluster labels
    C_labels = np.arange(0, len(np.unique(cluster.labels_)) + 1)
    (C_hist, _) = np.histogram(cluster.labels_, bins=C_labels)
    C_hist = C_hist.astype("float")
    C_hist /= C_hist.sum()

    # Create a rectangle to visualize dominant colors
    dict_list = [{} for _ in range(5)]
    img_colors = sorted(
        [(percent, color) for (percent, color) in zip(C_hist, C_centroids)], key=lambda x: x[0],
    )
    start = 0
    i = 0
    for (percent, color) in img_colors:
        print((color), "{:0.2f}%".format(percent * 100))
        dict_list[i].update({'color': color, 'percent': "{:0.2f}%".format(percent * 100)})
        end = start + (percent * 300)
        start = end
        i += 1
    return dict_list

def crop_cat(img_path, model):
    results = model.predict(img_path, classes=15)
    result = results[0]
    print(results)

    masks = result.masks
    if(result.masks == None):
        return False
    
    # Retrieve segmentation mask and polygon
    mask1 = masks[0]
    mask = mask1.cpu().data[0].numpy()
    polygon = mask1.xy[0]

    # Open the input image
    im = Image.open(img_path).convert("RGBA")
    imArray = np.asarray(im)

    # Create a binary mask image
    maskIm = Image.new('L', (imArray.shape[1], imArray.shape[0]), 0)
    ImageDraw.Draw(maskIm).polygon(polygon, outline=1, fill=1)
    mask_ = np.array(maskIm)

    # Create a new RGBA image with the detected object in color and the background transparent
    newImArray = np.empty(imArray.shape,dtype='uint8')
    newImArray[:,:,:3] = imArray[:,:,:3]
    newImArray[:,:,3] = mask_*255
    newIm = Image.fromarray(newImArray, "RGBA")
    file_path = os.path.abspath('./img/')
    try:
        newIm.save(file_path + "out.png")
    except Exception as e:
        print(f"Error saving image: {e}")

    return True

def rgb_to_lab(rgb_color):
    # Convert RGB to CIELAB
    lab_color = rgb2lab(np.uint8([[rgb_color]]))
    return lab_color[0, 0]

def closest_colour(requested_colour):
    min_colours = {}
    for key, name in webcolors.CSS3_HEX_TO_NAMES.items():
        r_c, g_c, b_c = webcolors.hex_to_rgb(key)
        color1_lab = rgb_to_lab([r_c, g_c, b_c])
        color2_lab = rgb_to_lab(requested_colour)
        
        # Compute Euclidean distance in CIELAB space
        distance = sum((c1 - c2) ** 2 for c1, c2 in zip(color1_lab, color2_lab)) ** 0.5

        min_colours[distance] = name
    return min_colours[min(min_colours.keys())]

def color_similarity_lab(color1, color2):
    # Compute Euclidean distance in CIELAB space
    delta_L = color1[0] - color2[0]
    delta_a = color1[1] - color2[1]
    delta_b = color1[2] - color2[2]
    
    distance = (delta_L**2 + delta_a**2 + delta_b**2)**0.5
    return distance

def get_colour_name(requested_colour):
    try:
        closest_name = actual_name = webcolors.rgb_to_name(requested_colour)
    except ValueError:
        closest_name = closest_colour(requested_colour)
        actual_name = None
    return closest_name

def string_to_numpy_array(string):
    return np.fromstring(string[1:-1], sep=',')

def numpy_array_to_string(array):
    return np.array2string(array.astype(int), separator=' ')

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

# main functions
def get_color(image):
    model = YOLO("./models/yolov8m-seg.pt")
    if (crop_cat(image, model)):
        file_path = os.path.abspath('./img/')
        src_image = cv2.imread(file_path + "out.png")
        src_image = cv2.cvtColor(src_image, cv2.COLOR_BGR2RGB)
        reshape_img = src_image.reshape((src_image.shape[0] * src_image.shape[1], 3))

        KM_cluster = KMeans(n_clusters=5, n_init=10).fit(reshape_img)
        colors = return_Dominant_colors(KM_cluster, KM_cluster.cluster_centers_)

        print(colors[0]['color'], colors[1]['color'], colors[2]['color'], colors[3]['color'], colors[4]['color'])
        
        result = {
            'color1': numpy_array_to_string(colors[0]['color']),
            'color2': numpy_array_to_string(colors[1]['color']),
            'color3': numpy_array_to_string(colors[2]['color']),
            'color4': numpy_array_to_string(colors[3]['color']),
            'color5': numpy_array_to_string(colors[4]['color']),
            }
        return result
    else:
        print("no cat is detected")
        result = {
            'color1': np.NaN,
            'color2': np.NaN,
            'color3': np.NaN,
            'color4': np.NaN,
            'color5': np.NaN,
            }
        return result

def predict_resnet(image):
    device = torch.device('cpu')
    model = resnet50(pretrained=True).to(device)

    for parameter in model.parameters():
        parameter.requires_grad = False
    
    model.fc = ModelHead(2048, 1024, 12)
    model.fc.to(device)

    model.load_state_dict(torch.load('./models/resnet50.pth', map_location=device))
    model.eval()

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
    
    class_labels = ['Abyssinian', 'Bengal', 'Birman', 'Bombay', 'British Shorthair', 'Egyptian Mau', 'Maine Coon', 'Persian', 'Ragdoll', 'Russian Blue', 'Siamese', 'Sphynx'] 
    predicted_label = class_labels[predicted_class]
    print(f'Predicted class: {predicted_label}', predicted_class)

    result = {
        'breed': predicted_label,
        }

    return result