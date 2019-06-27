FROM node:11-alpine

# ARGS
ARG PROJECT_NAME=alexa-parkinson

# get default node user : 'node'
ARG USER=node
ARG WORKSPACE=/usr/dockers/devapp

# update system
RUN apk update && \
    apk add bash git && \
    npm -g config set user root
# allow npm to install as root user
#other solution : RUN npm -g install nodegit --unsafe-perm

# Create app directory
WORKDIR $WORKSPACE

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

#install project dependencies
RUN npm install --silent
RUN npm -v

# Bundle app source
COPY . .

# copy the check script : do what you want. see below for the call
COPY ./Docker/check-project.sh ./Docker/check-project.sh

##
# Since we are not creating any user here, you need to add the default docker's user
# to your computer by updatinf both following files:
# nano /etc/subuid
# nano /etc/subgid
# https://blog.ippon.tech/docker-and-permission-management/
#
# Exemple of content :
#  currentUser:1000:65536
#
# add node user
#  node:1000:65536
##
RUN chown -R $USER:$USER $WORKSPACE
RUN echo fs.inotify.max_user_watches=524288 >> /etc/sysctl.conf
RUN cat /proc/sys/fs/inotify/max_user_watches

USER $USER

RUN git config --global user.email "barbara.reliefapps@gmail.com"
RUN git config --global user.name "barbara.reliefapps"

RUN npm -g config set user $USER
RUN ls -la
RUN bash Docker/check-project.sh $PROJECT_NAME

EXPOSE 12118