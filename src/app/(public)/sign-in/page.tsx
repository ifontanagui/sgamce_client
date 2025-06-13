"use client"

import "./style.css"
import React from "react";
import { useRouter } from 'next/navigation'
import InputText from "@/components/InputText"
import Button from "@/components/Button";
import { Login as LoginFunction } from "@/services/auth-service";
import { deleteCookie, setCookie } from "cookies-next";
import Toast, { DispatchToast } from "@/components/Toast";

export default function Login() {
  const router = useRouter();
  
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("admin@email.com");
  const [emailError, setEmailError] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);

  const handleClick = async () => {
    if (!email || !password) {
      if (!email)
        setEmailError(true);
      
      if (!password)
        setPasswordError(true);
      
      return;
    }

    setLoading(true);
    const response = await LoginFunction(email, password);

    if (response.success) {
      deleteCookie('token')
      setCookie('token', response.token);
      deleteCookie('payload')
      setCookie('payload', JSON.stringify(response.payload));
      
      router.push("/");
    }
    else {
      DispatchToast({type: "error", message: response.message || "Erro ao fazer login, tente novamente"});
      setLoading(false);
    }
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-bg"></div>
      <div className="sign-in-bg sign-in-bg3"></div>
      <div className="sign-in-bg sign-in-bg2"></div>

      <div className="sign-in-content flex">
        <div className="sign-in-form flex">
          <div className="sign-in-title flex">
            <strong>Bem Vindo ao SGAMCE</strong>
            <span className="sign-in-text">Insira suas credencias para começarmos</span>
          </div>
          <InputText 
            type="email" 
            placeholder="Email"
            value={email}
            error={emailError}
            helperText="Informe o email"
            onChange={(event) => {
              setEmail(event.target.value)

              if (event.target.value && emailError) 
                setEmailError(false)
            }}
            required
          />
          <InputText 
            type="password" 
            placeholder="Password" 
            helperText="Informe a senha"
            value={password}
            error={passwordError}
            onChange={(event) => {
              setPassword(event.target.value)

              if (event.target.value && passwordError) 
                setPasswordError(false)
            }}
            required 
          />
          <Button className="sign-in-button" textContent="Entrar" isLoading={loading} onClick={handleClick}/>
          <div className="sign-in-without-user-text flex">
            <span className="sign-in-text">Não tem usuário?</span>
            <span className="sign-in-text">Contate um administrador para que ele crie um para você</span>
          </div>
        </div>
      </div>

      <Toast />
    </div>
  );
}
