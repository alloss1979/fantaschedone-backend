const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const API_KEY = "40e94a409232598ba1cfd36efe3ad91d";

app.get("/partite", async (req, res) => {
  const data = req.query.data;
  const stagione = req.query.stagione;

  try {
    const response = await axios.get(
      "https://v3.football.api-sports.io/fixtures",
      {
        headers: { "x-apisports-key": API_KEY },
        params: {
          league: 135,
          season: stagione,
          date: data
        }
      }
    );

    const partite = response.data.response.map(f => {
      let g1 = f.goals.home;
      let g2 = f.goals.away;

      let segno = "-";
      if (g1 !== null) {
        if (g1 > g2) segno = "1";
        else if (g1 < g2) segno = "2";
        else segno = "X";
      }

      return {
        casa: f.teams.home.name,
        trasferta: f.teams.away.name,
        risultato: segno
      };
    });

    res.json(partite);

  } catch (err) {
    res.status(500).json({ errore: "Errore API" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server avviato"));
