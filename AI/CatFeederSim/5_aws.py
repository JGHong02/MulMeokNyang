import numpy as np
import pandas as pd
import os
import boto3

# do this in your terminal first
# export AWS_ACCESS_KEY_ID=your-access-key-id
# export AWS_SECRET_ACCESS_KEY=your-secret-access-key

aws_access_key_id = os.environ.get('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
aws_region = 'ap-northeast-2'
bucket_name = 'sagemaker-ap-northeast-2-246943954331'
# this would be individual household
prefix = 'Cat/spaceId_123194564/'

session = boto3.Session(aws_access_key_id, aws_secret_access_key)

s3 = session.resource('s3')

my_bucket = s3.Bucket(bucket_name)

for my_bucket_object in my_bucket.objects.all():
    print(my_bucket_object.key)

# Create an S3 client
s3 = boto3.client('s3')

local_directory = 'photosForAI/'
os.makedirs(local_directory, exist_ok=True)

# List objects in the S3 bucket with the specified prefix
response = s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)

# Iterate through the objects and download each one
for obj in response.get('Contents', []):
    # Get the key (file path) of the object
    file_key = obj['Key']

    # Generate the local file path by concatenating the local directory and the key
    local_file_path = os.path.join(local_directory, file_key)

    # Create the local directory structure if it doesn't exist
    os.makedirs(os.path.dirname(local_file_path), exist_ok=True)

    # Download the file from S3 to the specified local path
    try:
        s3.download_file(bucket_name, file_key, local_file_path)
        print(f"File downloaded successfully to: {local_file_path}")
    except Exception as e:
        print(f"Error downloading file {file_key}: {e}")
        
