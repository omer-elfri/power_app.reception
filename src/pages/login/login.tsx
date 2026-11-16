'use client'

import React from "react";
import { useAuth } from "../../hooks/useAuth";

import { MyInput } from ".";
import { Bar } from "../../components/SectionBox";

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaCheck, FaUser } from "react-icons/fa";
import { LuEyeClosed } from "react-icons/lu";
import { IoKeyOutline } from "react-icons/io5";
import { RiUser6Line } from "react-icons/ri";
import { useVisual } from "../../hooks/useVisual";

export default function LogIn() {
  const { checkError } = useVisual();
  const { connect } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const loginHandler = React.useCallback(async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    (async () => {
      await connect(email, password);
      setPassword("");
      setLoading(false);
    })();
  }, [email, password]);

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
          <ReceptionSelect name='email' value={email} onTextChange={setEmail} />
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

      <button type="submit" disabled={email === '' || password === '' || loading} className="border-none self-end px-3 py-1 rounded bg-green-600 text-white">
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
  const { receptionnists } = useAuth();

  React.useEffect(() => {
    onTextChange?.(receptionnists.at(0)?.email ?? "");
  }, [receptionnists]);

  return (
    <select id={name} name={name} value={value} required
      onChange={e => onTextChange?.(e.target.value)}
      className="!border-none h-8 text-[14px] flex-1 uppercase font-bold text-gray-600">
      { receptionnists.map(employer => (
        <option key={employer.id} value={employer.email}>{employer.name}</option>
      )) }
    </select>
  );
}

