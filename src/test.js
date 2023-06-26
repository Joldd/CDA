import {writeFile} from 'node:fs/promises';

await writeFile('texte.txt', 'salutos', {flag:'a'});

