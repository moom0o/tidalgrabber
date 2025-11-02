if test -z "$1"; then
    echo "Missing variable, are you sure you want to use this script? Use start.sh instead"
fi
URL="${1%% *}"
NAME="${1#* }"
NAME="${NAME//\//-}"
mkdir -p ./music
if [[ ! -f "./music/${NAME}.flac" ]]; then
    echo "${NAME}"
    wget -q -U "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36" "$URL" -O "./music/${NAME}.flac"
    if [[ $? -ne 0 ]]; then
            echo "  -> Download failed (Server Error). Removing empty file for: ${NAME}.flac"
            rm -f "${NAME}.flac"
        else
            echo "  -> Download successful: ${NAME}.flac"
        fi
fi
