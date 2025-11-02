if test -z "$1"; then
    echo "Missing variable, are you sure you want to use this script? Use start.sh instead"
fi
URL="${1%% *}"
NAME="${1#* }"
echo $URL
echo $NAME
mkdir -p ./music
wget -U "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36" "$URL" -O "./music/${NAME}.flac"