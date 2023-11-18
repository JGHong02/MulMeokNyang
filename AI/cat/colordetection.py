# saved for later use: notebook this for documentation

#%%
import cv2
from ultralytics import YOLO
import numpy as np
from PIL import Image, ImageDraw
from sklearn.cluster import KMeans
import webcolors

def visualize_Dominant_colors(cluster, C_centroids):
    # Calculate histogram of cluster labels
    C_labels = np.arange(0, len(np.unique(cluster.labels_)) + 1)
    (C_hist, _) = np.histogram(cluster.labels_, bins=C_labels)
    C_hist = C_hist.astype("float")
    C_hist /= C_hist.sum()

    # Create a rectangle to visualize dominant colors
    rect_color = np.zeros((50, 300, 3), dtype=np.uint8)
    img_colors = sorted(
        [(percent, color) for (percent, color) in zip(C_hist, C_centroids)]
    )
    start = 0
    for (percent, color) in img_colors:
        print(color, "{:0.2f}%".format(percent * 100))
        end = start + (percent * 300)
        cv2.rectangle(
            rect_color,
            (int(start), 0),
            (int(end), 50),
            color.astype("uint8").tolist(),
            -1,
        )
        start = end
    return rect_color

def return_Dominant_colors(cluster, C_centroids):
    # Calculate histogram of cluster labels
    C_labels = np.arange(0, len(np.unique(cluster.labels_)) + 1)
    (C_hist, _) = np.histogram(cluster.labels_, bins=C_labels)
    C_hist = C_hist.astype("float")
    C_hist /= C_hist.sum()

    # Create a rectangle to visualize dominant colors
    dict_list = [{} for _ in range(5)]
    img_colors = sorted(
        [(percent, color) for (percent, color) in zip(C_hist, C_centroids)]
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

# Path to the input image
img_path = "./img/id_1/image0174.jpg"

# YOLO model for object detection and segmentation
model = YOLO("yolov8m-seg.pt")

#%%
results = model.predict(img_path)
result = results[0]
print(result.masks == None)

#%%
# Retrieve segmentation mask and polygon
masks = result.masks
mask1 = masks[0]
mask = mask1.cpu().data[0].numpy()
polygon = mask1.xy[0]
#%%
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
newIm.save("out.png")

# Load the resulting image
src_image = cv2.imread("out.png")
src_image = cv2.cvtColor(src_image, cv2.COLOR_BGR2RGB)
reshape_img = src_image.reshape((src_image.shape[0] * src_image.shape[1], 3))

# Apply K-Means clustering to identify dominant colors
KM_cluster = KMeans(n_clusters=5).fit(reshape_img)

print(return_Dominant_colors(KM_cluster, KM_cluster.cluster_centers_))
# Visualize dominant colors in a rectangle
visualize_color = visualize_Dominant_colors(KM_cluster, KM_cluster.cluster_centers_)
visualize_color = cv2.cvtColor(visualize_color, cv2.COLOR_RGB2BGR)

# Display the visualization
cv2.imshow("visualize_Color", visualize_color)
cv2.waitKey()

