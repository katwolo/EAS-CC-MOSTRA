# EAS CC · Mostra — instruccions per a Claude

Aquest repositori és la **versió de demostració** de l'aplicació oficial **EAS CC** (`katwolo/EAS-CC`).

## Regles

- **EAS CC (oficial) és només de lectura.** No s'hi modifica mai cap fitxer, ni s'hi fa cap commit, branca o push.
- Tot el treball es fa en aquest repositori (EAS-CC-MOSTRA).

## Ordre «actualiza»

Quan l'usuari escrigui només **«actualiza»** (o «actualitza»), vol dir:

1. Fer `fetch` del repositori oficial EAS CC i mirar la seva branca per defecte (actualment `main`).
2. Comparar-la amb l'últim commit sincronitzat (vegeu més avall) i revisar els canvis de `index.html`, `code.gs`, `help.html` i `activitats CC/`.
3. Portar els canvis a la Mostra:
   - `index.html`: aplicar els canvis de la interfície mantenint les adaptacions de la demo (accés per rol, banner, ajudes 💡, recorregut, CSV del buidatge, `call()` cap a `DemoBackend`).
   - `code.gs` → `demo-backend.js`: reproduir les accions noves o modificades amb dades fictícies (sense Google Sheets, correus ni serveis externs). Si cal, incrementar `STORE_KEY` perquè els visitants rebin les dades noves.
   - `help.html` i `activitats CC/`: copiar-los anonimitzats (sense noms ni correus reals de contacte, sense enllaços a Gemini, i amb el logotip del centre substituït).
   - Actualitzar les explicacions de la demo (`DEMO_INFO`, `TOURS`) i el `README.md` si hi ha funcions noves.
4. Provar al navegador els tres rols i les funcions noves.
5. Fer commit i push a la branca de treball de la Mostra, i actualitzar aquí l'últim commit sincronitzat.

## Últim commit sincronitzat de l'oficial

`c0e8c46` (branca `main`, 23/11/2026) — «Support decimal CC weights (fix rounding to integer)».
