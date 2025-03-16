# This should only be run directly and located one directory above the project
echo y | docker image prune
cp Huzzicide/.env h.env
rm -rf Huzzicide
git clone https://github.com/aLEGEND21/Scrapyard-Huzzicide.git Huzzicide
cp h.env Huzzicide/.env
rm -rf h.env
cd Huzzicide
bash run.sh