# Winterquiz 2024

Winterquiz-Website and -Server.
Die Website wird durch Node.js (Express) bereitgestellt, Kommunikation läuft über Sockets und die Daten werden am Server aufbereitet.

---

## ToDo

### Generelle Entscheidungen

* Gibt es einen Timer, der abläuft?  
    Und wenn ja, wie viele Sekunden hat man zum Antworten?  
    -> Ja, >= 15s (20s ?)
* Wie viele Fragen muss man beantworten?  
    -> 8
* Wie viele Fragen gibt es?  
    -> Nur so viele wie nötig ~~, oder werden x aus y>x ausgewählt?~~
* Sind die Fragen am Client bekannt, oder müssen sie vom Server übermittelt werden?  
    -> Müssen an Client übermittelt werden
* Wie werden die Ergebnisse zurück an den Server übermittelt? (Wie kriegt man einen Usernamen etc.?)
* Wie werden die Antworten bewertet?  
    -> alle gleich (1 Punkt pro Frage)

### Frontend

* [x] Erstellen eines ersten Entwurfs der Hauptseite
* [x] Erstellen der Startseite, die Informationen über das Quiz enthält
* [ ] Erstellen der Ergebnisseite, die die finale Punktzahl anzeigt
* [ ] Implementierung des Spielflusses  
  * [ ] Einfügen eines Username-Formulars in/nach der Startseite
  * [ ] Herausfinden, wie man mit JS die IP-Adresse ausliest und das implementieren
* [x] Implementierung der Fragenkarten-Flipanimation  
  * [x] Entscheiden, wo die Erklärung der Antwort angezeigt wird  
    -> Statt Frage ~~Statt Antworten? Auf Rückseite der Fragekarte?~~
* [ ] Implementierung der Eiskristall-Animation
* [x] Entscheiden, ob Rausch-Effekt verwendet werden soll  
    -> ja, mindestens für Haupt-Hintergrund
* [x] Entscheiden, ob zwei verschiedene Schriftgrößen für kurze/lange(mehrzeilige) Antwortmöglichkeiten existieren sollen (genauso bei Erklärungen)
  * [ ] Implementierung der verschiedenen SChriftgrößen (mithilfe der Länge der Anwtirten/Erklärungen)

### Backend

* [x] Einlesen aus externer Datei und zufälliges Auswählen der Fragen
* [ ] Austausch mit dem Client
* [ ] Speicherung der Ergebnisse, die der Client zurückschickt
  * [ ] Anonyme Speicherung aller Fragen mit zugehöriger Antwort (answers.csv)
  * [ ] Speicherung der Highscores mit zugehörigem Namen (scores.csv)
* [ ] Visualisierung aller Ergebnisse (vgl. Bestenliste?)
* [x] Erstellen eines schönen QR-Codes

---

## Inbetriebnahme

### Benötigte Pakete

* `npm install express@4`
* `npm install socket.io`
* `npm install csv-parser`
* `npm install csv-writer`

### Start

* Die Datei *server.js* muss aus dem Order ***server*** gestartet werden  
    `cd ../server`  
    `node server.js`
* Das serverstartende Endgerät öffnet auf einen Zugang auf Port 3000
