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
import { toast } from "sonner";

const ZatvoriDialog = ({ idProblem, openDialog }) => {
  const [problem, setProblem] = useState(null);

  const alertDialogRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (idProblem) {
        try {
          const problemResponse = await axios.get(
            `http://localhost:3000/problemi?id=${idProblem}`,
            {
              withCredentials: true,
            }
          );
          const fetchedProblem = problemResponse.data[0];
          setProblem(fetchedProblem);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [idProblem]);

  useEffect(() => {
    if (openDialog && alertDialogRef.current) {
      alertDialogRef.current.click();
    }
  }, [openDialog]);

  const handleClose = async () => {
    try {
      const problemData = Array.isArray(problem) ? problem[0] : problem;
      console.log("Podaci prvog problema:", problemData);

      const vehicleId = problemData.id_vozila?._id;

      if (vehicleId) {
        const serviceResponse = await axios.put(
          `http://localhost:3000/vozila/povrat-sa-servisa/${vehicleId}`,
          {
            withCredentials: true,
          }
        );
        console.log("Odgovor povratka sa servisa:", serviceResponse.data);
        toast("Vozilo je vraćeno sa servisa.");
      } else {
        console.error("ID vozila nije pronađen u problemu.");
        toast("Greška: ID vozila nije pronađen.");
        return;
      }

      console.log("Pokušaj zatvaranja problema s ID-jem:", idProblem);
      const response = await axios.put(
        `http://localhost:3000/problemi/zatvori/${idProblem}`,
        {
          withCredentials: true,
        }
      );
      console.log("Odgovor na zatvaranje problema:", response.data);

      if (response.status === 200) {
        console.log("Problem uspješno zatvoren.");
        toast("Problem Zatvoren.");
      } else {
        console.error("Neuspješno zatvaranje problema.");
        toast("Došlo je do pogreške pri zatvaranju.");
      }
    } catch (error) {
      console.error("Greška u handleClose funkciji:", error);
      toast("Došlo je do pogreške pri zatvaranju.");
    }
  };

  if (!problem) return <div>Učitavanje...</div>;

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger ref={alertDialogRef}>
          <div className=" bg-gray-100 px-4 rounded-[30px] border border-gray-300 py-2 whitespace-nowrap font-semibold">
            u tijeku
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Zatvori prijavljen problem!</AlertDialogTitle>
            <AlertDialogDescription>
              Problem je riješen i šteta je sanirana? Zatvorite problem dodirom
              na gumb "Zatvori".
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Nazad</AlertDialogCancel>
            <AlertDialogAction onClick={handleClose}>Zatvori</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ZatvoriDialog;
