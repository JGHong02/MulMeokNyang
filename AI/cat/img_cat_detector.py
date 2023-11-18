
# coding: utf-8

# ### Reference https://opencv-python-tutroals.readthedocs.io/en/latest/py_tutorials/py_objdetect/py_face_detection/py_face_detection.html#face-detection
# 
# #### prerequisite :  pip install opencv-python

import numpy as np
import cv2 


# ### Download haarcascade xml files from https://github.com/opencv/opencv/tree/master/data/haarcascades
# 
# READ LICENSE TERMS BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
# 
# #### curl -O https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalcatface.xml
# 
# 
# #### curl -O https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalcatface_extended.xml

cat_cascade = cv2.CascadeClassifier('./haars/haarcascade_frontalcatface.xml')
cat_ext_cascade = cv2.CascadeClassifier('./haars/haarcascade_frontalcatface_extended.xml')


# ### Set Tunable parameters

SF=1.05  # try different values of scale factor like 1.05, 1.3, etc
N=3 # try different values of minimum neighbours like 3,4,5,6


# #### For each image 
# * Read the image
# * convert to gray scale
# * use the above two cascades to get coordinates of rectangles
# * plot the rectangles

def processImage(image_dir,image_filename):
    # read the image
    img = cv2.imread(image_dir+'/'+image_filename)
    # convery to gray scale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # this function returns tuple rectangle starting coordinates x,y, width, height
    cats = cat_cascade.detectMultiScale(gray, scaleFactor=SF, minNeighbors=N)
    #print(cats) # one sample value is [[268 147 234 234]]
    cats_ext = cat_ext_cascade.detectMultiScale(gray, scaleFactor=SF, minNeighbors=N)
    #print(cats_ext)
    
    # draw a blue rectangle on the image
    for (x,y,w,h) in cats:
        img = cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)       
    # draw a green rectangle on the image 
    for (x,y,w,h) in cats_ext:
        img = cv2.rectangle(img,(x,y),(x+w,y+h),(0,255,0),2)
    
    # save the image to a file
    cv2.imwrite('./out/out_'+image_filename,img)

for idx in range(2,100):
    processImage('./img/predict/crops/cat/','image0'+str(idx)+'.jpg')

# ### Plot the images 

# import matplotlib.pyplot as plt
# import matplotlib.image as mpimg
# 
# img = mpimg.imread('out1.jpg')
# plt.imshow(img)
# 
# img = mpimg.imread('out2.jpg')
# plt.imshow(img)
# 
# img = mpimg.imread('out3.jpg')
# plt.imshow(img)\

