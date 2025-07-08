import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AutoAd from "../components/AutoAd"; // Import AutoAd component

const OProjektu = () => {
  return (
    <div className="p-6">
      {/* Auto Ads will be inserted here */}
      <AutoAd /> {/* PropellerAds will automatically insert banner ads */}
      {/* Tabovi za načine igre */}
      <div className="flex justify-center">
        <Tabs defaultValue="today" className="w-full max-w-[600px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today">Današnja igra</TabsTrigger>
            <TabsTrigger value="random">Vježba</TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <Card>
              <CardHeader>
                <CardTitle>Današnja igra</CardTitle>
                <CardDescription>
                  "Današnja igra" je dnevni izazov koji je isti za sve igrače.
                  Svaki dan generira se novi set pitanja, a cilj je odgovoriti
                  što točnije na sva pitanja. Ovaj način igre savršen je za
                  testiranje vašeg znanja i usporedbu s drugima!
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="random">
            <Card>
              <CardHeader>
                <CardTitle>Vježba</CardTitle>
                <CardDescription>
                  Način "Vježba" omogućuje vam vježbanje s nasumično generiranim
                  pitanjima. Svaki put kada igrate, dobivate novi set pitanja
                  kako biste uvježbali svoje znanje. Koristite ovaj način za
                  pripremu za dnevni izazov ili jednostavno za zabavu!
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {/* Često postavljana pitanja */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Često postavljana pitanja
        </h2>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-[600px] mx-auto"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Koja je razlika između "Današnje igre" i "Vježbe"?
            </AccordionTrigger>
            <AccordionContent>
              "Današnja igra" je dnevni izazov s istim pitanjima za sve igrače,
              dok "Vježba" generira nasumična pitanja svaki put kada igrate, što
              je savršeno za vježbanje.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Kako igrati igru?</AccordionTrigger>
            <AccordionContent>
              Odaberite način igre, pročitajte pitanja i upišite svoje odgovore.
              Imate ograničen broj života, pa pazite da ne pogriješite previše
              puta!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Što se događa ako izgubim sve živote?
            </AccordionTrigger>
            <AccordionContent>
              Ako izgubite sve živote, igra završava. Možete je ponovno
              pokrenuti i pokušati poboljšati svoj rezultat!
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default OProjektu;
