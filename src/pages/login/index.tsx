'use client'

import React from "react";

import { useAuth } from "../../hooks/useAuth";
import { FaCheck, FaRegUser, FaUser } from "react-icons/fa";
import { Bar } from "../../components/SectionBox";
import { employers_datas } from "../../configs/employer";
import { TbLockPassword } from "react-icons/tb";
import { LuEyeClosed } from "react-icons/lu";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Employer from "../../types/employer";
import { IoKeyOutline } from "react-icons/io5";
import { RiUser6Line } from "react-icons/ri";

export default function LoginPage() {
  const { connect } = useAuth();
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [failed, setFailed] = React.useState("");
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const receptionnists = Object.entries(employers_datas)
    .filter(([_, employer]) => {
      const rules = employer.rules as Employer.Rule[];
      return rules.includes(Employer.Rule.RECEPTIONIST);
    })
    .map(([id, employer]) => ({ ...employer, id }));

  const loginHandler = React.useCallback(async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    setFailed("");
    setLoading(true);
    setTimeout(() => {
      try {
        connect(username, password);
      } catch(e) {
        setFailed("Le mot de passe est incorrect");
      }
      setPassword("");
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div style={{ backgroundImage: "url('/rue marina.jpg')" }} className="bg-no-repeat bg-center bg-cover bg-white absolute inset-0">
      <div className="flex justify-center items-center gap-5 w-full h-full bg-black/70 backdrop-blur-sm">

        <form className="flex flex-col gap-3 bg-gray-200 px-10 py-5 rounded-md shadow min-w-[400px]" onSubmit={loginHandler}>

          <div className="p-10 mt-[-100px] shadow rounded-full bg-gray-200 self-center">
            <FaUser size={50} />
          </div>

          <MyInput label="Utilisateur" icon={<RiUser6Line />}>
              <select id="username" name="username" required
                value={userName} onChange={e => setUserName(e.target.value)}
                className="!border-none h-8 text-[14px] flex-1 uppercase font-bold text-gray-600">
                { receptionnists.map(employer => (
                  <option key={employer.id} value={employer.id}>{employer.name}</option>
                )) }
              </select>
          </MyInput>

          <MyInput label="Mot de passe" icon={<IoKeyOutline />}>
              <input type={ showPass ? "text" : "password"} id="password" name="password" required autoFocus
                className="!border-none pl-2 h-8 text-[14px] tracking-wide flex-1" placeholder="X X X X"
                value={password} onChange={(e) => setPassword(e.target.value)} />
              { showPass
                ? <MdOutlineRemoveRedEye className="" onClick={() => setShowPass(false)} />
                : <LuEyeClosed className="" onClick={() => setShowPass(true)} /> }
          </MyInput>

          <p className="text-[12px] text-center text-red-800 font-bold my-2">{failed}</p>

          <Bar className="mb-1" />

          <button type="submit" disabled={loading} className="border-none self-end px-3 py-1 rounded bg-green-600 text-white">
            <span className="text-[14px] font-bold">Valider</span> <FaCheck />
          </button>

        </form>

      </div>
    </div>
  );
}

function MyInput({ label, name, icon, children }: {
  label: string,
  name?: string,
  icon: React.ReactNode,
  children: React.ReactNode,
}) {
  return (
    <div className="flex flex-col gap-2">

      <label htmlFor={name}>{label}</label>

      <div className="grid grid-cols-[16px_auto_1fr] items-center gap-3 border-1 !border-gray-400 \
        shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] px-2 py-1 rounded">

        {icon} <div className="border-l-1 border-gray-400 h-4" />

        <div className="flex flex-row items-center gap-3">
          { children }
        </div>

      </div>

    </div>
  );
}

