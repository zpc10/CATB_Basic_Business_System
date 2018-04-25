# 在执行过“Prerequisites.doc”之后进行以下操作：

1.cnpm install -g composer-cli@0.16.0

2.cnpm install -g generator-hyperledger-composer@0.16.0

3.cnpm install -g composer-rest-server@0.16.0

4.cnpm install -g yo

## 下载样例：

git clone https://github.com/zpc10/CATB_Basic_Business_System.git

mv CATB_Basic_Business_System Basic-Business-System


## 把运行中的其他容器服务停掉：

* docker kill $(docker ps -q)
* docker rm $(docker ps -aq)
* docker rmi $(docker images dev-* -q)


##  定义要连接的服务的别名

export FABRIC_VERSION=hlfv1

## 下载fabrci执行环境

cd ~/Basic-Business-System/fabric-tools/

./downloadFabric.sh

## 启动fabrci服务：

./startFabric.sh

## 创建连接文件和认证卡（只有0.16.0需要，之后已经废除）

./createComposerProfile.sh

./createPeerAdminCard.sh

cd ../

## 项目依赖初始化：

npm install

## 生成项目Bna文件：

composer archive create -a dist/decentralized-resource-network.bna --sourceType dir --sourceName .

cd dist

composer archive list -a decentralized-resource-network.bna

## 运行时环境搭建（只有0.16.0以下版本需要，以上版本已废除）：

composer runtime install -c PeerAdmin@hlfv1 --businessNetworkName decentralized-resource-network

## 在composer中启动业务：

composer network start -c PeerAdmin@hlfv1 --networkAdmin admin -S adminpw -a  decentralized-resource-network.bna -f networkadmin.card

## 导入业务卡（导入一次即可，以后启动业务不再需要导入）：

composer card import --file networkadmin.card

## 测试业务是否跑通：

composer network ping --card admin@decentralized-resource-network

## 启动api服务和管理后台服务：

cd ../angular-app

## 初始化依赖：

npm install

## 启动服务：

npm start
