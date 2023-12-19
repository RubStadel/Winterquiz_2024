# Winterquiz 2024

Winterquiz-Website and -Server.
Die Website wird durch Node.js bereitgestellt und die Daten werden am Server aufbereitet.

---

## ToDo

### Generelle Entscheidungen

* Gibt es einen Timer, der abläuft?  
    Und wenn ja, wie viele Sekunden hat man zum Antworten?  
    -> Ja, >= 15s
* Wie viele Fragen muss man beantworten?  
    -> ca. 8-10
* Wie viele Fragen gibt es?  
    -> Nur so viele wie nötig ~~, oder werden x aus y>x ausgewählt?~~
* Sind die Fragen am Client bekannt, oder müssen sie vom Server übermittelt werden?  
    -> Müssen an Client übermittelt werden
* Wie werden die Ergebnisse zurück an den Server übermittelt? (Wie kriegt man einen Usernamen etc.?)
* Wie werden die Antworten bewertet?  
    -> alle gleich (1 Punkt pro Frage)

### Frontend

* [x] Erstellen eines ersten Entwurfs der Hauptseite
* [ ] Erstellen der Startseite, die Informationen über das Quiz enthält
* [ ] Erstellen der Ergebnisseite, die die finale Punktzahl anzeigt
* [ ] Implementierung des Spielflusses
* [ ] Implementierung der Fragenkarten-Flipanimation
* [ ] Implementierung der Eiskristall-Animation (falls es einen Timer gibt)
* [ ] Entscheiden, ob Rausch-Effekt verwendet werden soll

### Backend

* [ ] Einlesen aus externer Datei und zufäliges Auswählen der Fragen
* [ ] Speicherung der Ergebnisse, die der Client zurückschickt
* [ ] Visualisierung aller Ergebnisse (vgl. Bestenliste?)
* [ ] Erstellen eines schönen QR-Codes
