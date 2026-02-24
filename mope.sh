#!/usr/bin/env bash

set -e -o pipefail

ProgName=$(basename "$0")

# Ensure we're in the script's directory
pushd "$(dirname "$(readlink -f "${BASH_SOURCE:0}")")" > /dev/null
trap "popd > /dev/null" EXIT

sub_help(){
    echo "Usage: $ProgName <subcommand> [options]"
    echo "Sub commands:"
    echo "    build [target]"
    echo "        Build the specified docker image(s), or all images."
    echo ""
    echo "    manage <...args>"
    echo "        Run \"python manage.py <args>\" in the web container."
    echo ""
    echo "    django"
    echo "        Run a Django shell in a new web container."
    echo ""
    echo "    shell"
    echo "        Run a Bash shell in a new web container."
    echo ""
    echo "    build [target]"
    echo "        Build the specified docker image(s), or all images."
    echo ""
    echo "    up [web|celery|pop|...]"
    echo "        Run \"docker compose up\" to start all services or the specified services."
    echo ""
    echo "    down"
    echo "        Stop and remove all containers & ephemeral volumes."
    echo ""
    echo "    shell"
    echo "        Run a python shell in a new web container."
}

sub_build(){
    set -x
    docker compose build "$@"
    { set +x; } 2>/dev/null
}

sub_up(){
    set -x +e
    docker compose up "$@"
    { set +x -e; } 2>/dev/null
}

sub_down(){
    set -x +e
    docker compose rm -sfv
    docker compose down
    { set +x -e; } 2>/dev/null
}

sub_manage(){
    set -x
    docker compose exec -it backend python manage.py "$@"
    { set +x; } 2>/dev/null
}

sub_django(){
    set -x
    docker compose run --rm backend python manage.py shell_plus
    { set +x; } 2>/dev/null
}

sub_shell(){
    set -x
    docker compose run --rm frontend sh
    { set +x; } 2>/dev/null
}

subcommand=$1
case $subcommand in
    "" | "-h" | "--help")
        sub_help
        ;;
    *)
        shift
        sub_"${subcommand}" "$@"
        if [ $? = 127 ]; then
            echo "Error: '$subcommand' is not a known subcommand." >&2
            echo "       Run '$ProgName --help' for a list of known subcommands." >&2
            exit 1
        fi
        ;;
esac
