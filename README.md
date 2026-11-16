# EAS CC · Mostra (versió de demostració)

> **Registre d'evidències i avaluació de les Capacitats Clau dels cicles formatius**
> Versió de demostració per ensenyar l'aplicació a persones externes al centre.

---

## Què és aquesta mostra?

És una còpia funcional de l'aplicació **EAS CC** pensada per a presentacions i proves:

- **No està connectada a cap Google Sheet ni a cap servei extern.** Tot funciona dins del navegador.
- **Totes les persones, classes i notes són fictícies**, generades automàticament.
- Es pot fer servir tot: enregistrar evidències, editar-les, crear activitats i projectes, gestionar usuaris… Els canvis **només es guarden al navegador de qui fa la prova** i no afecten ningú més.
- El botó **↺ Restablir dades** de la barra superior torna a les dades inicials.

## Com s'hi accedeix

En lloc d'usuari i contrasenya, la pantalla d'inici mostra tres targetes per entrar directament amb cada rol:

| Rol | Persona fictícia | Què pot fer |
|-----|------------------|-------------|
| **Professor/a** | Laia Ferrer | Enregistrar evidències, consultar l'Inici, l'Historial, el Resum MP i l'Alumnat, exportar PDF i el buidatge (CSV), i gestionar activitats i projectes dels seus mòduls. |
| **Alumne/a** | Aina Puig (1A) | Consultar el seu resum de Capacitats Clau (només amb colors) i l'historial d'activitats avaluades. |
| **Administrador/a** | Joana (Admin Demo) | Gestionar usuaris, classes, desdoblaments, avisos de contrasenya, el catàleg comú d'activitats i els exemples pràctics. |

Des de la barra superior (**Veure com a…**) es pot canviar de rol en qualsevol moment sense tornar a la pantalla d'inici.

## Ajudes incloses a la demo

- **Explicació a cada pantalla**: un requadre 💡 a dalt explica què fa la secció. Es pot tancar; el botó **?** (a baix a la dreta) el torna a mostrar.
- **Recorregut guiat**: la primera vegada que s'entra amb cada rol, un recorregut curt assenyala les parts principals del menú. Es pot repetir amb **▶ Recorregut**.
- **Casos preparats per ensenyar funcionalitats**:
  - *2n · 2A · Esports d'equip i d'implements*: mòdul amb **desdoblaments** (Grup 1 / Grup 2).
  - *1r · 1A · Esports individuals*: hi apareix una alumna de 2n amb el **mòdul pendent**.
  - *1r · 1A · Valoració de la condició física*: hi ha un alumne **no matriculat**.
  - *Administració → Avisos*: dues sol·licituds de restabliment de contrasenya pendents.

## Diferències respecte de la versió real

| Funció | Versió real | Mostra |
|--------|-------------|--------|
| Dades | Google Sheets del centre | Dades fictícies al navegador |
| Accés | Usuari i contrasenya personals | Accés directe per rol |
| Restablir contrasenya | Envia un correu a l'usuari | Es simula i s'indica amb un missatge |
| Buidatge de seguiment | Crea un Google Sheet | Es descarrega un fitxer **CSV** (obre amb Excel o Google Sheets) |
| Assistents externs | Enllaços a assistents d'IA | Eliminats |

## Publicar-la (GitHub Pages)

1. A GitHub, ves a **Settings → Pages**.
2. A *Build and deployment*, tria **Deploy from a branch**, la branca on hi ha aquests fitxers i la carpeta **/(root)**.
3. Desa. En uns minuts la mostra estarà disponible a l'adreça que indica GitHub.

També es pot obrir en local servint la carpeta amb qualsevol servidor estàtic (per exemple `python3 -m http.server`) i obrint `index.html`.

## Fitxers

| Fitxer | Contingut |
|--------|-----------|
| `index.html` | Interfície de l'aplicació (la mateixa que la real, amb les adaptacions de la demo). |
| `demo-backend.js` | Backend simulat: reprodueix les accions del servidor real i genera les dades fictícies. |
| `activitats CC/index.html` | Presentacions dels exemples pràctics. |
