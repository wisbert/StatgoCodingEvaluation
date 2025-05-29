"use client";

import { ItemSelect } from "@/components";
import { calculateCodePrice } from "@/utilities/calculateCodePrice";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";

const Calculator = () => {
  const [codes, setCode] = useState<Code[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<(Code | null)[]>([null]);
  const [modifiers, setModifiers] = useState<(Modifier)[]>([]);

  const fetchCodes = async () => {
    const response = await fetch("api/codes");
    const codesList = await response.json() as Code[];
    const filteredCodes = codesList.map(code => ({
      ...code,
      modifiers: code.modifiers.filter(modifier => modifier.modifier_type !== "LMTS")
    }))
    setCode(filteredCodes);
  };

  const increamentRowIndex = (index: number, multiplier: number) => index + multiplier * 3

  const handleModifierChange = (index: number, modifier: Modifier) => {
    setModifiers(prev => {
      const updatedModifiers = [...prev];
      updatedModifiers[index] = modifier;

      return updatedModifiers;
    });
  };

  const handleCodeChange = (index: number, code: Code) => {
    setSelectedCodes(prev => {
      const updatedCodes = [...prev];
      updatedCodes[index] = code;

      if (index === updatedCodes.length - 1) {
        updatedCodes.push(null)
      }
  
      return updatedCodes;
    });
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const finalPrice =
    codes && modifiers ? calculateCodePrice({ selectedCodes, modifiers }) : 0;

  return (
    <main className="">
      <h1>Calculator</h1>
      <h3>Context</h3>
      <p>
        When a physician treats a patient, we call that an encounter. During
        that encounter, the physician performs multiple procedures which we
        refer to as codes.
      </p>
      <p>
        Each code can have up to 3 modifiers which modify the base price based
        on many factors such the patient, the location, the time, how many
        procedures, etc...
      </p>
      <p>
        Our goal is to calculate the price of a single code based on the
        combination of modifiers the user can select
      </p>
      <p>TODO:</p>
      <ul>
        <li>Fix the UI to change the price when modifiers change</li>
        <li>
          Users should not be able to select modifiers that are of modifier_type
          LMTS
        </li>
        <li>
          Only display modifier 2 if modifier 1 is set, modifier 3 if modifier 2
          is set
        </li>
      </ul>
      <p>
        Bonus: Add an endpoint for retrieving multiple codes and let a user
        build a full encounter
      </p>

      {codes.length > 0 ? selectedCodes.map((selectedCode, index) => (
      <Grid container spacing={2} paddingY={1} key={`${index}gridRow`}>
         <Grid item xs={3}>
          <ItemSelect<Code>
            selectedItem={selectedCode}
            items={codes || []}
            onChange={(selected) => handleCodeChange(0 + index, selected)} 
            getText={c => c.code}
            >
            Code
        </ItemSelect>
        </Grid>
        {selectedCode && <Grid item xs={3}>
          <ItemSelect<Modifier>
            selectedItem={modifiers[increamentRowIndex(0, index)]}
            items={selectedCode?.modifiers || []}
            onChange={(selected) => handleModifierChange(increamentRowIndex(0, index), selected)} 
            getText={m => m.modifier_code}
            >
            Modifier 1
          </ItemSelect>
        </Grid>}
        {modifiers[increamentRowIndex(0, index)] && <Grid item xs={3}>
          <ItemSelect<Modifier> 
            selectedItem={modifiers[increamentRowIndex(1, index)]}
            items={selectedCode?.modifiers || []}
            onChange={(selected) => handleModifierChange(increamentRowIndex(1, index), selected)}
            getText={m => m.modifier_code}
          >
            Modifier 2
          </ItemSelect>
        </Grid>}
        {modifiers[increamentRowIndex(0, index)] && modifiers[increamentRowIndex(1, index)] && <Grid item xs={3}>
          <ItemSelect<Modifier>
            selectedItem={modifiers[increamentRowIndex(2, index)]}
            items={selectedCode?.modifiers || []}
            onChange={(selected) => handleModifierChange(increamentRowIndex(2, index), selected)}
            getText={m => m.modifier_code}
          >
            Modifier 3
          </ItemSelect>
        </Grid>}
      </Grid>
      ))
       : (
        <p>Loading</p>
      )}
      

      <p>The Price is: {finalPrice.toFixed(2)}</p>
    </main>
  );
};

export default Calculator;
