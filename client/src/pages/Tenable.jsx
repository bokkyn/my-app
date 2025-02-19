import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Upute from "@/components/Upute";

const Tenable = () => {
  const [targetFootballers, setTargetFootballers] = useState([]);
  const [footballers, setFootballers] = useState([]);
  const [guessed, setGuessed] = useState([]);
  const [lives, setLives] = useState(3);
  const [selectedFootballer, setSelectedFootballer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [promptText, setPromptText] = useState("");
  const [hearts, setHearts] = useState([true, true, true]); // State to control visible hearts

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const response = await axios.get(
          "https://tenable-server.vercel.app/api/prompts/random"
        );
        const promptData = response.data;
        console.log("Fetched prompt:", promptData);
        if (!promptData || !promptData.query) {
          throw new Error("Nema podataka o promptu.");
        }

        setPromptText(promptData.prompt);

        // Fetch players based on the query in the prompt
        const footballersResponse = await axios.post(
          "https://tenable-server.vercel.app/api/footballers/query",
          { query: promptData.query } // Sending the query from the prompt
        );
        const footballersFromPrompt = footballersResponse.data.map(
          (player) => ({
            id: `${player.first_name} ${player.last_name}`,
          })
        );

        setTargetFootballers(footballersFromPrompt);
        setGuessed(Array(footballersFromPrompt.length).fill(null));
      } catch (err) {
        console.error("Pogreška pri dohvaćanju prompta ili nogometaša:", err);
        setError("Nije moguće učitati današnji prompt.");
      }
    };

    const fetchFootballers = async () => {
      try {
        const response = await axios.get(
          "https://tenable-server.vercel.app/api/footballers"
        );
        setFootballers(response.data);
      } catch (err) {
        console.error("Pogreška pri dohvaćanju nogometaša:", err);
      }
    };

    // Fetch prompt and footballers concurrently
    Promise.all([fetchPrompt(), fetchFootballers()]).finally(() =>
      setLoading(false)
    );
  }, []);

  useEffect(() => {
    // Update hearts based on the lives left
    const newHearts = [lives >= 1, lives >= 2, lives >= 3];
    setHearts(newHearts);
  }, [lives]); // Re-run whenever lives change

  const handleGuess = () => {
    if (!selectedFootballer) return;

    const foundIndex = targetFootballers.findIndex(
      (player) => player.id === selectedFootballer.value
    );

    if (foundIndex !== -1 && !guessed[foundIndex]) {
      const newGuessed = [...guessed];
      newGuessed[foundIndex] = selectedFootballer.value;
      setGuessed(newGuessed);
    } else {
      setLives((prevLives) => prevLives - 1);
    }

    setSelectedFootballer(null);
  };

  if (loading) return <p className="text-center font-sans">Učitavanje...</p>;
  if (error)
    return <p className="text-center text-destructive font-sans">{error}</p>;

  return (
    <div className="max-w-md mx-auto p-4 sm:px-6 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center text-foreground">
        Tenable Croatia
      </h1>
      <Upute naslov={promptText}></Upute>
      <div className="text-center mb-4">
        {/* Render hearts based on lives */}
        {hearts.map((isVisible, index) => (
          <span
            key={index}
            className={`text-xl ${
              isVisible ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {isVisible ? "❤️" : "💔"}
          </span>
        ))}
      </div>

      <div className="flex flex-col items-center mb-4">
        {guessed.map((player, index) => (
          <div
            key={index}
            className="flex items-center mb-2 w-full justify-between"
          >
            <div
              className={`flex-grow h-12 border-2 rounded-lg flex items-center justify-center ${
                lives === 0 && player === null
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-background text-foreground"
              }`}
            >
              {player ||
                (lives === 0
                  ? targetFootballers[index].id
                  : index + 1 + ".  ???")}
            </div>
            <span className="text-sm ml-2"></span>
          </div>
        ))}
      </div>

      <div className="flex flex-row items-center justify-center gap-3 mb-4 w-full">
        <Select
          className="w-full max-w-xs mb-4 border-2 border-input rounded-lg font-sans"
          options={footballers.map((footballer) => ({
            value: `${footballer.first_name} ${footballer.last_name}`,
            label: `${footballer.first_name} ${footballer.last_name}`,
          }))}
          value={selectedFootballer}
          onChange={setSelectedFootballer}
          placeholder="Odaberi nogometaša"
          classNamePrefix="react-select"
        />
        <button
          onClick={handleGuess}
          disabled={!selectedFootballer}
          className="bg-primary text-primary-foreground py-2 mb-4 px-4 rounded-lg disabled:bg-muted disabled:text-muted-foreground font-medium"
        >
          Pogodi
        </button>
      </div>

      {lives === 0 && (
        <h2 className="text-center text-destructive mt-4 font-medium">
          Izgubio/la si! Pokušaj ponovo.
        </h2>
      )}

      {guessed.every((p) => p !== null) && (
        <h2 className="text-center text-success mt-4 font-medium">
          Čestitamo! Pogodio/la si sve.
        </h2>
      )}
    </div>
  );
};

export default Tenable;
