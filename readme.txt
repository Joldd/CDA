Utilisation en local
    Installer Docker Desktop (Il faut activer hypervisor assisted virtualization dans le bios)
    Installer la dernière version LTS de Node.js
    Si première fois : npm install
    docker compose up --build (x2 des fois?)

server.cjs
    Crée la BDD
    Crée le serveur

package.json
    Définit ce qu'il faut Installer

Dockerfile
    Définit les commandes qui vont être executés avec docker compose up

docker-compose
    Définit la BDD