#!/usr/bin/env sh

PROJECT_NAME="sms-order-268506"
SPACE_NAME="rwa-tool"
APP_NAME="ey-backend-nodejs"
HOST_NAME=gcr.io
VALUE_VERSION_STRING=`date '+%y.%m%d.%H%M'`
IMAGE=$HOST_NAME/$PROJECT_NAME/$SPACE_NAME/$APP_NAME
IMAGE_LINK="$HOST_NAME\/$PROJECT_NAME\/$SPACE_NAME\/$APP_NAME:$VALUE_VERSION_STRING"

function checkoutCode()
{
    echo "========> CHECKING OUT CODE..."
    rm -rf code
    git clone https://github.com/duc-vvd/calculation_tool.git -b main code
    cd code/
    echo "========> CHECK OUT CODE DONE!!!"
}

function buildDocker()
{
    echo "✈✈ Bat dau build docker image. ✈✈"
    echo "🛴 Image se tao: ${IMAGE_LINK} 🛴"
    pwd
    docker build -t $IMAGE . --file=./Dockerfile
    echo "✈✈ Bat dau tao tag cho image. ✈✈"
    docker tag $IMAGE $IMAGE:$VALUE_VERSION_STRING
    echo "✈✈ Da tao tag cho image xong. ✈✈"
    
    echo "✈✈ Bat dau push len repo. ✈✈"
    gcloud auth configure-docker
    docker push $IMAGE:$VALUE_VERSION_STRING
    cd ..
    rm -rf code
    echo "✈✈ Da push len repo xong. ✈✈"
}

function createDeployment()
{
    echo "✈✈ Bat dau day len Kubenetes"
    pwd
    cp deployment.yml deployment-$APP_NAME.yml
    oldText=##IMAGE_LINK##
    newText=$IMAGE_LINK
    sed -i '' "s/$oldText/$newText/g" deployment-$APP_NAME.yml
    oldText=##DATABASE_URL##
    newText="sms-orders:asia-southeast1:sms-orders"
    sed -i '' "s/$oldText/$newText/g" deployment-$APP_NAME.yml
    kubectl delete -f deployment-$APP_NAME.yml
    kubectl create -f deployment-$APP_NAME.yml
    rm deployment-$APP_NAME.yml
    docker rmi "$IMAGE:latest"
    docker rmi "$IMAGE:$VALUE_VERSION_STRING"
    echo "✈✈ Da day len Kubenetes xong ✈✈"
}

checkoutCode
buildDocker
createDeployment
