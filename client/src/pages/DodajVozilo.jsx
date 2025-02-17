"use client";
import modeliVozila from "../components/modeliVozila.json";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ComboBox = ({ options, value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
          />
          <CommandList>
            <CommandEmpty>Nije pronađeno.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const DodajVozilo = () => {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    registracija: "",
    marka: "",
    model: "",
    tip_vozila: "",
    mjenjac: "Mehanički",
    godina_proizvodnje: currentYear,
    datum_tehnickog_pregleda: "",
  });
  const [markaOptions, setMarkaOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const tipoviVozila = [
    { value: "hatchback", label: "Hatchback" },
    { value: "sedan", label: "Sedan" },
    { value: "kombi", label: "Kombi" },
    { value: "SUV", label: "SUV" },
    { value: "karavan", label: "Karavan" },
    { value: "coupe", label: "Coupe" },
    { value: "kabriolet", label: "Kabriolet" },
  ];

  const tipoviMjenjaca = [
    { value: "mehanički", label: "Mehanički" },
    { value: "automatski", label: "Automatski" },
    { value: "sekvencijski", label: "Sekvencijski" },
  ];

  useEffect(() => {
    setMarkaOptions(
      Object.keys(modeliVozila).map((marka) => ({
        value: marka,
        label: marka.charAt(0).toUpperCase() + marka.slice(1),
      }))
    );
  }, []);

  useEffect(() => {
    if (formData.marka) {
      setModelOptions(modeliVozila[formData.marka] || []);
    } else {
      setModelOptions([]);
    }
  }, [formData.marka]);

  useEffect(() => {
    if (formData.model) {
      const selectedModel = modelOptions.find(
        (model) => model.value === formData.model
      );
      if (selectedModel) {
        setFormData((prev) => ({
          ...prev,
          tip_vozila: selectedModel.tip_vozila,
        }));
      }
    }
  }, [formData.model, modelOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.registracija ||
      !formData.marka ||
      !formData.model ||
      !formData.tip_vozila ||
      !formData.datum_tehnickog_pregleda
    ) {
      toast.error("Sva polja moraju biti ispunjena.");
      setLoading(false);
      return;
    }

    if (formData.godina_proizvodnje > currentYear) {
      toast.error("Uozbilji se, godina proizvodnje je u budućnosti.");
      setLoading(false);
      return;
    }

    if (formData.godina_proizvodnje < 1886) {
      //baza easteregg
      toast.error("Prvi automobil je izumljen 1886.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:3000/vozila", formData, {
        withCredentials: true,
      });
      toast.success("Vozilo uspješno dodano!");
      setFormData({
        registracija: "",
        marka: "",
        model: "",
        tip_vozila: "",
        mjenjac: "Mehanički",
        godina_proizvodnje: currentYear,
        datum_tehnickog_pregleda: "",
      });
    } catch (error) {
      toast.error("Došlo je do greške prilikom dodavanja vozila.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dodaj Vozilo</CardTitle>
          <CardDescription>
            Popunite podatke o vozilu za dodavanje u bazu.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="registracija">Registracija</Label>
            <Input
              type="text"
              id="registracija"
              name="registracija"
              value={formData.registracija}
              onChange={handleChange}
              required
              placeholder="Registracija (npr. ZG1234AA)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="marka">Marka</Label>
            <ComboBox
              options={markaOptions}
              value={formData.marka}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  marka: value,
                  model: "",
                }))
              }
              placeholder="Odaberite marku"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <ComboBox
              options={modelOptions}
              value={formData.model}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, model: value }))
              }
              placeholder="Odaberite model"
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2 space-y-2">
              <Label htmlFor="tip_vozila">Tip Vozila</Label>
              <ComboBox
                options={tipoviVozila}
                value={formData.tip_vozila}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, tip_vozila: value }))
                }
                placeholder="Tip Vozila"
              />
            </div>
            <div className="w-1/2 space-y-2">
              <Label htmlFor="mjenjac">Mjenjač</Label>
              <ComboBox
                options={tipoviMjenjaca}
                value={formData.mjenjac}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, mjenjac: value }))
                }
                placeholder="Mjenjač"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="godina_proizvodnje">Godina Proizvodnje</Label>
            <Input
              type="number"
              id="godina_proizvodnje"
              name="godina_proizvodnje"
              value={formData.godina_proizvodnje}
              onChange={handleChange}
              required
              placeholder="Godina proizvodnje (npr. 2020)"
              min={1886}
              max={currentYear}
            />
          </div>
          <div className="space-y-2 space-x-1">
            <Label htmlFor="datum_tehnickog_pregleda">
              Datum Tehničkog Pregleda
            </Label>
            <Input
              className="flex justify-center"
              type="date"
              id="datum_tehnickog_pregleda"
              name="datum_tehnickog_pregleda"
              value={formData.datum_tehnickog_pregleda}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Učitavanje..." : "Dodaj Vozilo"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DodajVozilo;
