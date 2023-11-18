import shutil
from ultralytics import YOLO
import cv2
import os
import time

location = "C:/Users/sento/Documents/Python/cat/img/predict/"
dir_1 = "crops"
dir_2 = "labels"
path_1 = os.path.join(location, dir_1)
path_2 = os.path.join(location, dir_2)
shutil.rmtree(path_1) 
shutil.rmtree(path_2) 

model = YOLO("yolo-Weights/yolov8x.pt")
model.to('cuda')

video_path = "./dataset/catvideo.mp4"
cap = cv2.VideoCapture(video_path)

t_end = time.time() + 120 # for 2min
ret = True
count = 0

while time.time() < t_end:
    ret, frame = cap.read()
    results = model.track(frame, save_txt=True, save_crop=True, project="img", exist_ok=True, augment=True, classes=15)
    frame_ = results[0].plot()
    print(results)
    
    if ret:
        count += 10 # i.e. at 30 fps, this advances one second
        cap.set(cv2.CAP_PROP_POS_FRAMES, count)

    if cv2.waitKey(25) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()