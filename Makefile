###
# Config
###

JOBS ?= $(shell nproc)
MAKEFLAGS += -j $(JOBS) -r

export PATH := $(abspath node_modules)/.bin:$(PATH)

.DELETE_ON_ERROR:
.SECONDARY:
.SUFFIXES:

###
# Clean
###

.PHONY: clean
clean:
	rm -fr node_modules target

###
# Format
###

FORMAT_SRC := $(shell \
	find . \
		-not \( -name node_modules -prune \) \
		-not \( -name target -prune \) \
		-name '*.html' \
		-o -name '*.json' \
		-o -name '*.md' \
		-o -name '*.scss' \
		-o -name '*.ts' \
)

.PHONY: format
format: target/format.target

.PHONY: test-format
test-format: target/format-test.target

target/format.target: target/node_modules.target $(FORMAT_SRC)
	prettier --write $(FORMAT_SRC)
	mkdir -p $(@D)
	touch $@ target/format-test.target

target/format-test.target: target/node_modules.target $(FORMAT_SRC)
	prettier -c $(FORMAT_SRC)
	mkdir -p $(@D)
	touch $@ target/format.target

###
# npm
###

target/node_modules.target: package.json $(wildcard yarn.lock)
	yarn install
	mkdir -p $(@D)
	> $@

###
# Angular
###

NG_SRC := \
	angular.json \
	tsconfig.json \
	webpack-extra.config.js \
	$(shell find src -name '*.html' -o -name '*.json' -o -name '*.png' -o -name '*.scss' -o -name '*.ts')

.PHONY: build
build: target/ng/dev.target

.PHONY: build-prod
build-prod: target/ng/prod.target

.PHONY: watch
watch: target/node_modules.target
	rm -fr target/ng/dev
	ng build --watch

target/ng/dev.target: target/node_modules.target $(NG_SRC)
	rm -fr $(@:.target=)
	ng build
	> $@
	du -hs $(@:.target=)

target/ng/prod.target: target/node_modules.target $(NG_SRC)
	rm -fr $(@:.log=)
	ng build --prod
	> $@
	du -hs $(@:.target=)

target/explore.target: target/node_modules.target $(NG_SRC)
	rm -fr $(@:.log=)
	ng build --prod --outputPath $(@:.log=) --sourceMap true
	mkdir -p $(@D)
	> $@
	du -hs $(@:.target=)

###
# Extension
###

.PHONY: extension
extension: target/extension.zip

target/extension.zip: target/ng/prod.target
	mkdir -p $(@D)
	cd $(<:.target=) && zip -r ../../extension .
	du -hs $@

###
# Explore
###

.PHONY: explore
explore: target/explore.html

target/explore.html: target/explore.target target/node_modules.target
	mkdir -p $(@D)
	find $(<:.log=) -name '*.css' -or -name '*.js' -print0 | xargs -0 source-map-explorer --html $@
	@echo $@
