# Winterquiz 2024

Winterquiz-Website and -Server.
Die Website wird durch Node.js bereitgestellt und die Daten werden mit [?] verarbeitet.

---

## ToDo

### Generelle Entscheidungen

* Gibt es einen Timer, der abläuft?  
    Und wenn ja, wie viele Sekunden hat man zum Antworten?
* Wie viele Fragen muss man beantworten?
* Wie viele Fragen gibt es? Nur so viele wie nötig, oder werden x aus y>x ausgewählt?
* Sind die Fragen am Client bekannt sind, oder müssen sie vom Server übermittelt werden?
* Wie werden die Ergebnisse zurück an den Server übermittelt? (Wie kriegt man einen Usernamen etc.?)
* Wie werden die Antworten bewertet?

### Frontend

* [x] Erstellen eines ersten Entwurfs der Hauptseite
* [ ] Erstellen der Startseite, die Informationen über das Quiz enthält
* [ ] Erstellen der Ergebnisseite, die die finale Punktzahl anzeigt
* [ ] Implementierung des Spielflusses
* [ ] Implementierung der Fragenkarten-Flipanimation
* [ ] Implementierung der Eiskristall-Animation (falls es einen Timer gibt)
* [ ] Entscheiden, ob Rausch-Effekt verwendet werden soll

### Backend

* [ ] (evtl. Einlesen aus externer Datei) und zufäliges Auswählen der Fragen
* [ ] Speicherung der Ergebnisse, die der Client zurückschickt
* [ ] Visualisierung aller Ergebnisse (vgl. Bestenliste?)
* [ ] Erstellen eines schönen QR-Codes
