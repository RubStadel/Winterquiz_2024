# Winterquiz 2024

Frontend-Website and Server für das Winterquiz des FSR VII der BHT, erstellt für und verwendet beim Winterfest 2024.  

## Überblick

Die Website wird durch Node.js (Express) bereitgestellt, Kommunikation läuft über Sockets und die Daten werden am Server aufbereitet.  
Über das Auslesen, Speichern und Abgleichen der temporären IPv6-Adressen eines jeden Benutzers wird (ausreichend) sichergestellt, dass jeder Benutzer nur einmal (pro Endgerät) teilnehmen kann.  

> Alle Benutzer **müssen** im selben Netzwerk sein, in dem sich auch der Server befindet.

Über das Erstellen eines passenden QR-Codes, der die IPv4-Adresse inklusive Portnummer des Servers enthält, wird der Zugriff auf das Quiz erleichtert.  

Alle Fragen, Antworten und Erklärungen werden aus der Datei *moderator.csv* gelesen.  
Anonyme Daten, die zur Auswertung der Verteilung der Antworten genutzt werden können, werden in *answers.csv* gesperichert.  
Ergebnisse werden mitsamt des gewählten Benutzernamens in *scores.csv* gespeichert.

---

## Inbetriebnahme des Servers

### Benötigte Programme

* Node.js: [download site](https://nodejs.org/en/download "Node.js downloads")

### Benötigte Pakete installierbar über Eingabeaufforderung

* `npm install express@4`
* `npm install socket.io`
* `npm install csv-parser`
* `npm install csv-writer`

### Start

* Die Datei *server.js* muss aus dem Order ***server*** gestartet werden  
    `cd ../server`  
    `node server.js`
* Das serverstartende Endgerät öffnet einen Zugang auf Port 3000

---

## ToDo

### Generelle Entscheidungen

* Gibt es einen Timer, der abläuft?  
    Und wenn ja, wie viele Sekunden hat man zum Antworten?  
    -> ~~Ja, >= 15s (20s ?)~~ Nein
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
* [x] Implementierung des Spielflusses  
  * [x] Einfügen eines Username-Formulars in/nach der Startseite
  * [x] Herausfinden, wie man mit JS die IP-Adresse ausliest und das implementieren  
    -> Temporäre IPv6-Adresse bleibt (bei meinem) Handy (standardmäßig) >= 3 Stunden erhlten und ändert sich weder bei Netzwerkwechsel noch Serverneustart
  * [x] Erstellen der Ergebnisseite, die die finale Punktzahl anzeigt
* [x] Implementierung der Fragenkarten-Flipanimation  
  * [x] Entscheiden, wo die Erklärung der Antwort angezeigt wird  
    -> Statt Frage ~~Statt Antworten? Auf Rückseite der Fragekarte?~~
* [x] Entscheiden, ob Rausch-Effekt verwendet werden soll  
    -> ja, mindestens für Haupt-Hintergrund
* [x] Entscheiden, ob zwei verschiedene Schriftgrößen für kurze/lange(mehrzeilige) Antwortmöglichkeiten existieren sollen (genauso bei Erklärungen)
  * [x] Implementierung der verschiedenen Schriftgrößen (mithilfe der Länge der Anwtorten/Erklärungen)
* ~~[ ] Implementierung der Eiskristall-Animation~~

### Backend

* [x] Einlesen aus externer Datei und zufälliges Auswählen der Fragen
* [x] Austausch mit dem Client
* [x] Speicherung der Ergebnisse, die der Client zurückschickt
  * [x] Anonyme Speicherung aller Fragen mit zugehöriger Antwort (answers.csv)
  * [x] Speicherung der Highscores mit zugehörigem Namen (scores.csv)
* [x] Erstellen eines schönen QR-Codes
* [x] Visualisierung aller Ergebnisse (vgl. Bestenliste?)
