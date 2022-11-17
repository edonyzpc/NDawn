NODE_VERSION := $(shell node --version)

.PHONY: env startup test

env:
ifeq ($(NODE_VERSION)X,X)
# for ubuntu, reference from https://github.com/nodesource/distributions/blob/master/README.md#debinstall
	curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - && sudo apt-get install -y nodejs
	npm install yarn -g
else
	@echo "node version is $(NODE_VERSION), no need to install"
endif

startup: env
# startup
	yarn && yarn dev
