// KORIŠTENJE

// Parent Component:
// const options = [
//   { _id: "1", marka: "Toyota", model: "Corolla" },
//   { _id: "2", marka: "Honda", model: "Civic" },
//   { _id: "3", marka: "Ford", model: "Focus" },
// ];

// const transformVozilaData = (data) => {
//   return data.map((item) => ({
//     value: item._id, // Unique identifier
//     label: `${item.marka} ${item.model}`, // Concatenate marka and model
//   }));
// };

// Usage in Parent Component:
// <ComboBoxUniverzalni
//   options={options}  // Send the options directly as a prop
//onChange={(value) => setFormData((prev) => ({ ...prev, model: value }))} --TREBA I DFINIRATI OVU FUNKCIJU ZA SPREMNAJE
//   poruka="No vehicles found" // Placeholder message when no data is found
//   transformData={transformVozilaData} // Function to transform the data (optional)
// />
//PRIMJER IZ uzmiILIostavi
// options={dostupnaVozila.map((vozilo) => ({
//     value: vozilo._id,
//     label: `${vozilo.marka} ${vozilo.model} (${vozilo.registracija})`,
//   }))}
//   value={formData.model} // Pass the value from the state
//   onChange={(value) => setFormData((prev) => ({ ...prev, model: value }))} // Pass the onChange function
//   poruka="Nema slobodnih vozila koji odgovaraju tipu"
//   placeholder="Odaberite model"
// />

"use client";

import { useState } from "react"; // Import useState directly
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

function ComboBoxUniverzalni({
  options = [],
  poruka,
  transformData = (data) => data,
  value,
  onChange,
}) {
  const [open, setOpen] = useState(false);

  const transformedOptions = transformData(options);

  return (
    <div className="w-[300px] p-0">
      <Command>
        <CommandInput placeholder="Odaberi..." className="h-9" />
        <CommandList>
          <CommandEmpty>{poruka}</CommandEmpty>
          <CommandGroup>
            {transformedOptions.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                  setOpen(false);
                }}
              >
                {option.label}
                <Check
                  className={cn(
                    "ml-auto",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

export default ComboBoxUniverzalni;
