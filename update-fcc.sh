#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "You must supply a commit message as a positional parameter"
    exit 1
fi


cd ${HOME}/dev/src/github.com/first-contact-crypto/dev-firstcontactcrypto.com
echo "In $(pwd)"
git add . && git commit -m $1
git push origin master

cd ../first-contact-crypto.io
cp -rp ../dev-firstcontactcrypto.com/dist/* .
git add . && git commit -m $1
git push origin master
