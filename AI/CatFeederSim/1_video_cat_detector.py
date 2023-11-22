import shutil
from ultralytics import YOLO
import cv2
import os
import time

location = "./img/predict/"
dir_1 = "crops"
dir_2 = "labels"
path_1 = os.path.join(location, dir_1)
path_2 = os.path.join(location, dir_2)

if os.path.exists(path_1):
    shutil.rmtree(path_1) 
if os.path.exists(path_2):
    shutil.rmtree(path_2) 

model = YOLO("yolo-Weights/yolov8x.pt")
model.to('cuda')

video_path = "./data/test.mp4"
cap = cv2.VideoCapture(video_path)

t_end = time.time() + 120 # for 2min
ret = True
count = 0

while ret and time.time() < t_end:
    ret, frame = cap.read()
    if not ret:
        break

    results = model.track(frame, show=True, save_txt=True, save_crop=True, project="img", exist_ok=True, augment=True, classes=15)
    frame_ = results[0].plot()
    print(results)

    count += 10  # Increment frame count

    if cv2.waitKey(25) & 0xFF == ord('q'):
        break

    # Set the next frame
    cap.set(cv2.CAP_PROP_POS_FRAMES, count)

cap.release()
cv2.destroyAllWindows()