import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Upozorenja = () => {
  const [rezervacije, setRezervacije] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchRezervacije = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/rezervacije/rezervacije-specijalne",
          {
            withCredentials: true,
          }
        );
        setRezervacije(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRezervacije();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl">
      <Card className="bg-rose-50 ">
        <CardHeader>
          <CardTitle>Upozorenja za izvanredne situacije</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Ako se neko vozilo iznenada nađe u nenadanom problemu i zahtjeva
            servis, vožnja takvog vozila bila bi ilegalna ili opasna. Bilo bi
            dobro da se problem otkloni, a u najgorem slučaju kontaktirajte
            korisnika i otkažite rezervaciju.
            <br></br>
            Primjer: vozilo je već odavno rezervirano za period od 25.12. do
            27.12., registracija je odobrena, a u međuvremenu je bio potreban
            servis i ne zna se hoće li se stići napraviti do početka rezervacije
            itd.
          </CardDescription>
          <button
            className=" text-black p-2 rounded mt-4 "
            onClick={() => setShowContent(!showContent)}
          >
            {showContent ? "Sakrij upozorenja" : "Prikaži upozorenja"}
          </button>
          {showContent && (
            <div className="mt-4">
              {rezervacije.length === 0 ? (
                <p className="font-bold">
                  Nema posebnih upozorenja za rezervacije.
                </p>
              ) : (
                <ul className="list-none">
                  {rezervacije.map((rezervacija) => (
                    <li
                      className="flex flex-col items-center mb-4 p-2 border-b border-gray-300"
                      key={rezervacija._id}
                    >
                      <span className="font-bold">
                        {rezervacija.id_vozila.marka}{" "}
                        {rezervacija.id_vozila.model} (
                        {rezervacija.id_vozila.registracija})
                      </span>
                      <span className="italic">
                        {rezervacija.id_korisnika.ime}{" "}
                        {rezervacija.id_korisnika.prezime}
                      </span>
                      <span>
                        <strong>Razlog:</strong>{" "}
                        {rezervacija.razlozi.join(", ")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Upozorenja;
