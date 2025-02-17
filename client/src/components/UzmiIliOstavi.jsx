import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import ComboBox from "../components/ComboBoxUniverzalni";
import { toast } from "sonner";

const UzmiIliOstavi = ({ idRezervacije, openDialog }) => {
  const [rezervacija, setRezervacija] = useState(null);
  const [dostupnaVozila, setDostupnaVozila] = useState([]);
  const [formData, setFormData] = useState({ model: "" });

  const alertDialogRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (idRezervacije) {
        try {
          const rezervacijaResponse = await axios.get(
            `http://localhost:3000/rezervacije?id=${idRezervacije}`,
            {
              withCredentials: true,
            }
          );
          const fetchedRezervacija = rezervacijaResponse.data[0];
          setRezervacija(fetchedRezervacija);

          const vozilaResponse = await axios.post(
            `http://localhost:3000/vozila/spremna-za-iznajmljivanje`,
            {
              pocetak: fetchedRezervacija.vrijeme_pocetka,
              zavrsetak: fetchedRezervacija.vrijeme_zavrsetka,
              tip_vozila: fetchedRezervacija.tip_vozila,
            },
            {
              withCredentials: true,
            }
          );
          setDostupnaVozila(vozilaResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [idRezervacije]);
  useEffect(() => {
    if (openDialog && alertDialogRef.current) {
      alertDialogRef.current.click();
    }
  }, [openDialog]);

  const handleAccept = async () => {
    if (!formData.model) {
      toast("Molimo odaberite vozilo");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/rezervacije/prihvati/${idRezervacije}`,
        {
          id_vozila: formData.model,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Rezervacija prihvaćena:", response.data);
        window.location.reload();
        toast("Rezervacija je prihvaćena i vozilo je dodijeljeno"); // Success message
      } else {
        toast("Došlo je do pogreške pri prihvaćanju rezervacije.");
      }
    } catch (error) {
      console.error("Error accepting reservation:", error);
      toast("Došlo je do pogreške pri prihvaćanju rezervacije.");
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/rezervacije/odbij/${idRezervacije}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      window.location.reload();
      toast("Rezervacija je odbijena");
    } catch (error) {
      console.error("Error rejecting reservation:", error);
      toast("Došlo je do pogreške pri odbijanju rezervacije.");
    }
  };

  if (!rezervacija) return <div>Učitavanje...</div>;

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger ref={alertDialogRef}>
          <div className=" bg-gray-100 px-4 rounded-[30px] border border-gray-300 py-2 whitespace-nowrap font-semibold">
            na čekanju
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Prihvati ili odbij rezervaciju</AlertDialogTitle>
            <AlertDialogDescription>
              Ako prihvatite rezervaciju, odaberite vozilo.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4 py-4">
            {/* User name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ime" className="text-right">
                Ime:
              </Label>
              <div id="ime" className="col-span-3">
                {rezervacija.id_korisnika.ime}{" "}
                {rezervacija.id_korisnika.prezime}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tip" className="text-right">
                Tip vozila:
              </Label>
              <div id="tip" className="col-span-3">
                {rezervacija.tip_vozila}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="razlog" className="text-right">
                Razlog i poruka:
              </Label>
              <div id="razlog" className="col-span-3">
                {rezervacija.razlog}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vrijeme_pocetka" className="text-right">
                Vrijeme početka:
              </Label>
              <div id="vrijeme_pocetka" className="col-span-3">
                {new Date(rezervacija.vrijeme_pocetka).toLocaleString("hr-HR", {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </div>

              <Label htmlFor="vrijeme_zavrsetka" className="text-right">
                Vrijeme završetka:
              </Label>
              <div id="vrijeme_zavrsetka" className="col-span-3">
                {new Date(rezervacija.vrijeme_zavrsetka).toLocaleString(
                  "hr-HR",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }
                )}
              </div>
            </div>

            <AlertDialogDescription>
              Dodijelite dostupno vozilo traženog tipa.
            </AlertDialogDescription>

            <ComboBox
              options={dostupnaVozila.map((vozilo) => ({
                value: vozilo._id,
                label: `${vozilo.marka} ${vozilo.model} (${vozilo.registracija})`,
              }))}
              value={formData.model}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, model: value }))
              }
              poruka="Nema slobodnih vozila koji odgovaraju tipu"
              placeholder="Odaberite model"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Nazad</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject}>Odbij</AlertDialogAction>
            <AlertDialogAction onClick={handleAccept}>
              Prihvati
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UzmiIliOstavi;
