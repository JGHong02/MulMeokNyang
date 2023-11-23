import cv2
from ultralytics import YOLO
import numpy as np
from PIL import Image, ImageDraw
from sklearn.cluster import KMeans
import webcolors
import pandas as pd
import os

# YOLO model for object detection and segmentation
model = YOLO("yolov8m-seg.pt")

def closest_colour(requested_colour):
    min_colours = {}
    for key, name in webcolors.CSS3_HEX_TO_NAMES.items():
        r_c, g_c, b_c = webcolors.hex_to_rgb(key)
        rd = (r_c - requested_colour[0]) ** 2
        gd = (g_c - requested_colour[1]) ** 2
        bd = (b_c - requested_colour[2]) ** 2
        min_colours[(rd + gd + bd)] = name
    return min_colours[min(min_colours.keys())]

def get_colour_name(requested_colour):
    try:
        closest_name = actual_name = webcolors.rgb_to_name(requested_colour)
    except ValueError:
        closest_name = closest_colour(requested_colour)
        actual_name = None
    return closest_name

def return_Dominant_colors(cluster, C_centroids):
    # Calculate histogram of cluster labels
    C_labels = np.arange(0, len(np.unique(cluster.labels_)) + 1)
    (C_hist, _) = np.histogram(cluster.labels_, bins=C_labels)
    C_hist = C_hist.astype("float")
    C_hist /= C_hist.sum()

    # Create a rectangle to visualize dominant colors
    dict_list = [{} for _ in range(5)]
    img_colors = sorted(
        [(percent, color) for (percent, color) in zip(C_hist, C_centroids)],
        key=lambda x: x[0],
    )
    start = 0
    i = 0
    for (percent, color) in img_colors:
        print(color, "{:0.2f}%".format(percent * 100))
        dict_list[i].update({f'color_{i+1}': get_colour_name(color), f'color_{i+1}_percent': "{:0.2f}%".format(percent * 100)})
        end = start + (percent * 300)
        start = end
        i += 1
    return dict_list

def crop_cat(img_path):
    results = model.predict(img_path, classes=15)
    result = results[0]

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
    newIm.save("./img/out.png")

    return True

file_path = "./img/predict/labels/"
df = pd.read_csv(file_path + "image0.txt", sep=' ', header=0, names=['class', 'x1', 'y1', 'x2', 'y2', 'id', 'file_number'])
num_of_cats = df['id'].max()
image_extensions = ['.jpg', '.jpeg', '.png', '.bmp']
path = "./img/predict/crops/cat/id_"

if __name__ == '__main__':
    for i in range(num_of_cats):
        df = pd.read_csv(file_path + f"df_{i + 1}.csv", sep=' ', header=0, names=['class', 'x1', 'y1', 'x2', 'y2', 'id', 'file_number'])
        df.drop(columns=['x1', 'y1', 'x2', 'y2'], inplace=True)
        img_path = path + str(i + 1)
        imgs_list = [filename for filename in os.listdir(img_path) if os.path.splitext(filename)[-1] in image_extensions]

        for j in imgs_list:
            if (crop_cat(img_path + f"/{j}")):
                # Load the resulting image
                src_image = cv2.imread("./img/out.png")
                src_image = cv2.cvtColor(src_image, cv2.COLOR_BGR2RGB)
                reshape_img = src_image.reshape((src_image.shape[0] * src_image.shape[1], 3))
            
                # Apply K-Means clustering to identify dominant colors
                KM_cluster = KMeans(n_clusters=5, n_init=10).fit(reshape_img)
                colors = return_Dominant_colors(KM_cluster, KM_cluster.cluster_centers_)

                img_num = j[6:].replace('.jpg', "")
                k = 0
                for l in colors:
                    values = list(l.values())
                    df.loc[df[df["file_number"] == int(img_num)].index.tolist()[0], f"color_{k + 1}"] = values[0]
                    k += 1
                print(df.loc[df["file_number"] == int(img_num)])
            else:
                img_num = j[6:].replace('.jpg', "")
                k = 0
                for l in range(5):
                    df.loc[df[df["file_number"] == int(img_num)].index.tolist()[0], f"color_{k + 1}"] = np.NaN
                    k += 1
                print(df.loc[df["file_number"] == int(img_num)])
        
        df.to_csv(file_path + f"df_{i + 1}_new.csv", sep=' ', header=True, index=False)
