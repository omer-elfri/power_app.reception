'use client'

import React from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";

import { AuthSession } from "../../types/employer";
import { useDataContext } from "../../datas/context";
import PageTitle from "../../components/PageTitle";
import { FaCheck, FaUser } from "react-icons/fa";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuthSession } = useDataContext();
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div style={{ backgroundImage: "url('/rue marina.jpg')" }} className="bg-no-repeat bg-center bg-cover bg-white absolute inset-0">
      <div className="grid grid-cols-[3fr_7fr] gap-5 justify-center w-full h-full bg-black/70 backdrop-blur-sm">
{/* 
        <form className="flex flex-col gap-1 bg-gray-200 px-10 py-5 rounded-md shadow" onSubmit={async (e) => {
          e.preventDefault();
          const username = e.target.username.value;
          const password = e.target.password.value;
          const user = await invoke<AuthSession>("auth", { username, password });
          setPassword("");
          setAuthSession(user);
          navigate(user ? "/" : "/auth");
        }}>
          <div className="p-10 mt-[-100px] shadow rounded-full bg-gray-200 self-center">
            <FaUser size={50} />
          </div>

          <label className="font-bold text-[12px]">Username</label>
          <select name="username" value={userName} onChange={(e) => setUserName(e.target.value)} className="border-1 mb-3 px-20 py-10 w-60 h-8 text-[14px]">
            <option value="Hillary">Hillary</option>
            <option value="Romuald">Romuald</option>
          </select>

          <label className="font-bold text-[12px]">Mot de passe</label>
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-1 mb-3 px-2 py-1 w-60 text-[14px] rounded" />

          <button type="submit" className="border-1 self-end px-3 py-1 rounded text-[12px] font-bold bg-green-600 text-white">
            <span>Valider</span> <FaCheck />
          </button>

        </form> */}
        
        {/* <div className="flex flex-row items-center gap-5">

          <form className="flex flex-col gap-1 bg-gray-200 px-10 py-5 rounded-md shadow" onSubmit={async (e) => {
            e.preventDefault();
            const username = e.target.username.value;
            const password = e.target.password.value;
            const user = await invoke<AuthSession>("auth", { username, password });
            setPassword("");
            setAuthSession(user);
            navigate(user ? "/" : "/auth");
          }}>
            <div className="p-10 mt-[-100px] shadow rounded-full bg-gray-200 self-center">
              <FaUser size={50} />
            </div>

            <label className="font-bold text-[12px]">Username</label>
            <select name="username" value={userName} onChange={(e) => setUserName(e.target.value)} className="border-1 mb-3 px-20 py-10 w-60 h-8 text-[14px]">
              <option value="Hillary">Hillary</option>
              <option value="Romuald">Romuald</option>
            </select>

            <label className="font-bold text-[12px]">Mot de passe</label>
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-1 mb-3 px-2 py-1 w-60 text-[14px] rounded" />

            <button type="submit" className="border-1 self-end px-3 py-1 rounded text-[12px] font-bold bg-green-600 text-white">
              <span>Valider</span> <FaCheck />
            </button>

          </form>

          <img src="/Secure login-pana.png" className="w-60" alt="" />

        </div> */}

        <div className="bg-white/10 bg-backdrop min-h-30">

        </div>

        <form className="flex flex-col gap-3 px-15 py-5 font-bold text-[12px] text-white self-center">


            <label className="font-bold text-[12px]">Username</label>
            <select name="username" value={userName} onChange={(e) => setUserName(e.target.value)}
              className="border-1 mb-3 px-20 w-70 h-10 text-[14px] bg-white/10">
              <option value="Hillary">Hillary</option>
              <option value="Romuald">Romuald</option>
            </select>

            <label className="font-bold text-[12px]">Mot de passe</label>
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="border-1 mb-5 w-70 h-10 px-3 text-[14px] bg-white/10 rounded" />

            <button type="submit" className="self-end text-center rounded text-[12px] font-bold bg-green-600 text-white">
              <span>Valider</span> <FaCheck />
            </button>

        </form>

      </div>
    </div>
  );
}

