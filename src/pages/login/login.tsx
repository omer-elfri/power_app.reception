'use client'

import React from "react";
import { useAuth } from "../../hooks/useAuth";

import { MyInput } from ".";
import { Bar } from "../../components/SectionBox";
import { employers_datas } from "../../configs/employer";
import Employer from "../../types/employer";
import { State } from "../../types";

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaCheck, FaUser } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";
import { IoKeyOutline } from "react-icons/io5";
import { RiUser6Line } from "react-icons/ri";
import { useDataContext } from "../../hooks";

export default function LogIn() {
  const { checkError } = useDataContext();
  const { connect } = useAuth();
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const loginHandler = React.useCallback(async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    setLoading(true);
    setTimeout(() => {
      connect(username, password);
      setPassword("");
      setLoading(false);
    }, 1000);
  }, []);

  const forgetPass= React.useCallback(() => {
    checkError(() => {
      throw Error("Cette fonctionnalité n'est pas encore disponible, veuillez vous rapprocher de votre administrateur !");
    })
  }, []);

  return (
    <form className="flex flex-col gap-3 bg-gray-200 px-10 py-5 rounded-md shadow min-w-[400px]" onSubmit={loginHandler}>

      <div className="p-10 mt-[-100px] shadow rounded-full bg-gray-200 self-center">
        <FaUser size={50} />
      </div>

      <MyInput label="Utilisateur" icon={<RiUser6Line />}>
          <ReceptionSelect name='username' value={userName} onTextChange={setUserName} />
      </MyInput>

      <MyInput label="Mot de passe" icon={<IoKeyOutline />}>
          <input type={ showPass ? "text" : "password"} id="password" name="password" required autoFocus
            className="!border-none pl-2 h-8 text-[14px] flex-1 tracking-[0.3em] font-mono" placeholder="X X X X"
            value={password} onChange={e => setPassword(e.target.value)} />
          { showPass
            ? <MdOutlineRemoveRedEye className="" onClick={() => setShowPass(false)} />
            : <LuEyeClosed className="" onClick={() => setShowPass(true)} /> }
      </MyInput>

      <p className="text-center font-bold text-[12px] my-2 a" onClick={forgetPass}>Changer de mot de passe</p>

      <Bar className="mb-1" />

      <button type="submit" disabled={loading} className="border-none self-end px-3 py-1 rounded bg-green-600 text-white">
        <span className="text-[14px] font-bold">Valider</span> <FaCheck />
      </button>

    </form>
  );
}


export function ReceptionSelect({ name, value, onTextChange }: {
  name: string,
  value?: string,
  onTextChange?: (text: string) => void,
}) {
  const receptionnists = Object.entries(employers_datas)
    .filter(([_, employer]) => {
      const rules = employer.rules as Employer.Rule[];
      return rules.includes(Employer.Rule.RECEPTIONIST);
    })
    .map(([id, employer]) => ({ ...employer, id }));

  return (
    <select id={name} name={name} required
      value={value} onChange={e => onTextChange?.(e.target.value)}
      className="!border-none h-8 text-[14px] flex-1 uppercase font-bold text-gray-600">
      { receptionnists.map(employer => (
        <option key={employer.id} value={employer.id}>{employer.name}</option>
      )) }
    </select>
  );
}

