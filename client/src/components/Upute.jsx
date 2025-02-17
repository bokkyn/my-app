import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react"; 

const Upute = ({ naslov, opis }) => {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>{naslov}</AlertTitle>
      <AlertDescription>{opis}</AlertDescription>
    </Alert>
  );
};

export default Upute;
