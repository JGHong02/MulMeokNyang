#!/bin/bash

export AWS_ACCESS_KEY_ID=AKIATS7YBWWNULHPTJHI
export AWS_SECRET_ACCESS_KEY=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

python 1_video_cat_detector.py
python 2_file_organization.py
python 3_colordetection.py
python 4_breed_classification.py
python 5_aws.py
python 6_photosForAI_Processing.py
python 7_colordetection_2.py
python 8_breedclassificatino_2.py
python 9_similarity.py
python check_match.py

echo "This script took $SECONDS seconds to execute"