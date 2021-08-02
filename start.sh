#!/bin/bash

/usr/bin/yarn build
/usr/bin/yarn start
/user/bin/knex migrate:latest