// KAKO KORISTITI
// <AlertUniverzalni
// title="Jeste li sigurni?"
// description="    Ova radnja se ne može poništiti.
//         Trajno će izbrisati vozilo i ukloniti ga s poslužitelja.
//       Povijest i rezervacije vozila ostat će spremljene.
// buttonLabel="Continue"
// onConfirm={handleConfirm}
//buttonTextColor=...tailwind (inače crno)
// />
// </div>

import React from "react";
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
import { Button } from "@/components/ui/button";

const AlertUniverzalni = ({
  title,
  description,
  buttonLabel,
  onConfirm,
  buttonTextColor,
  children,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className={`${buttonTextColor ? buttonTextColor : "text-black"}`}
        >
          {buttonLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {children && <div>{children}</div>}
          <AlertDialogCancel>Nazad</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {buttonLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertUniverzalni;
