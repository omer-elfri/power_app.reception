'use client'

import React from "react";
import { useDataContext } from "../../hooks";
import { useAuth } from "../../hooks/useAuth";

import Popup from "..";
import { MyInput } from "../../pages/login";
import { Bar } from "../../components/SectionBox";

import { LuEyeClosed, LuMoveLeft } from "react-icons/lu";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

export default function ChangePassPopup() {
  const { authSession, connect } = useAuth();
  const { checkError, unPopup } = useDataContext();
  const [curPass, setCurPass] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submitHandler = React.useCallback(async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const curPass = e.target.current_pass.value;
    const newPass = e.target.new_pass.value;
    const confPass = e.target.confirm_pass.value;
    
    setLoading(true);
    setTimeout(() => {
      checkError(() => {
        connect(authSession!.id, curPass);
        if (!newPass) throw Error("Rentrez le nouveau mot de passe !");
        if (newPass.length < 8) throw Error("Le nouveau mot de passe doit doit comporter minimum 8 lettres !");
        if (newPass !== confPass) throw Error("Les mots de passe indiquées ne correspondent pas !");
        // changePassword(userName, newPass);
      }, `Mot de passe changée avec succès`);
      setCurPass("");
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Popup className="">
      {/* <PopupBody top={<h1 className="font-bold text-[16px]">Modifier mon mot de passe</h1>}> */}
      <div onClick={e => e.stopPropagation()} className="grid grid-cols-[150px_150px] gap-15">

        <form onSubmit={submitHandler} className="flex flex-col gap-3 bg-gray-200 px-10 py-5 rounded-md shadow min-w-[400px]">
          <h1 className="font-bold text-[16px]">Modifier mon mot de passe</h1>

          <MyInput label="Mot de passe" icon={<IoKeyOutline />}>
            <PassInput name="current_pass" value={curPass} onTextChange={setCurPass} autoFocus />
          </MyInput>

          <MyInput label="Nouveau mot de passe" icon={<IoKeyOutline />}>
            <PassInput name="new_pass" />
          </MyInput>

          <MyInput label="Confirmer mot de passe" icon={<IoKeyOutline />}>
            <PassInput name="confirm_pass" />
          </MyInput>

          <Bar className="my-3" />

          <div className="flex flex-row gap-3 justify-between items-center">

            <button onClick={unPopup} disabled={loading} className="self-end px-3 py-1 rounded border-2 text-blue-600 border-blue-600">
              <LuMoveLeft /> <span className="text-[14px] font-bold">Retour</span>
            </button>

            <button type="submit" disabled={loading} className="border-none self-end px-3 py-1 rounded bg-green-600 text-white">
              <span className="text-[14px] font-bold">Valider</span> <FaCheck />
            </button>

          </div>

        </form>

      </div>
      {/* </PopupBody> */}
    </Popup>
  );
}

function PassInput({ name, value, onTextChange,  autoFocus }: {
  name: string,
  value?: string,
  onTextChange?: (text: string) => void,
  autoFocus?: boolean,
}) {
  const [showPass, setShowPass] = React.useState(false);

  return (
    <div className="flex flex-row items-center gap-3 w-full">
      <input type={ showPass ? "text" : "password"} id="password" name={name} required  autoFocus={autoFocus}
        className="!border-none pl-2 h-8 text-[14px] tracking-wide flex-1 tracking-wide tracking-[20px]" placeholder="X X X X"
        value={value} onChange={e => onTextChange?.(e.target.value)} />
      { showPass
        ? <MdOutlineRemoveRedEye className="" onClick={() => setShowPass(false)} />
        : <LuEyeClosed className="" onClick={() => setShowPass(true)} /> }
    </div>
  );
}

