import React from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";

import { AuthSession } from "../../types/employer";
import { useDataContext } from "../../datas/context";
import PageTitle from "../../components/PageTitle";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuthSession } = useDataContext();
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div className="flex flex-col gap-5">

      <PageTitle name="Login Page" />

      <form className="flex flex-col gap-1" onSubmit={async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const user = await invoke<AuthSession>("auth", { username, password });
        setPassword("");
        setAuthSession(user);
        navigate(user ? "/" : "/auth");
      }}>
        <label>Username</label>
        <select name="username" value={userName} onChange={(e) => setUserName(e.target.value)} className="border-1">
          <option value="Hillary">Hillary</option>
          <option value="Romuald">Romuald</option>
        </select>
        <label>Mot de passe</label>
        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-1" />
        <input type="submit" value="Valider" className="border-1" />
      </form>

    </div>
  );
}

