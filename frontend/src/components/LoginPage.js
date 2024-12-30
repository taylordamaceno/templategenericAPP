import React, { useState } from 'react';
import axios from 'axios';
import logo from '../assets/images/MeuNovoApp.png';
import '../styles/LoginPage.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
        name: formData.nome,
        email: formData.email,
        password: formData.senha
      });
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao registrar:", error.response ? error.response.data : error.message);
      setErrorMessage("Erro ao registrar");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        email: formData.email,
        password: formData.senha
      });

      if (response && response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        window.location.href = '/dashboard';
      } else {
        setErrorMessage("Usuário ou senha inválidos");
      }
    } catch (error) {
      setErrorMessage("Usuário ou senha inválidos");
    }
  };

  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="LoginPage">
      <header>
        <img src={logo} alt="Logotipo do aplicativo" className="logo-img" />
        <h1>Cadastro / Login</h1>
      </header>
      <div className="tabs">
        <button onClick={() => setActiveTab('login')} className={activeTab === 'login' ? 'active' : ''}>Login</button>
        <button onClick={() => setActiveTab('register')} className={activeTab === 'register' ? 'active' : ''}>Cadastro</button>
      </div>
      <main>
        {activeTab === 'register' && (
          <section>
            <h2>Cadastro</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input type="text" className="form-control" id="nome" name="nome" placeholder="Seu nome" value={formData.nome} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" className="form-control" id="email" name="email" placeholder="Seu e-mail" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input type="password" className="form-control" id="senha" name="senha" placeholder="Sua senha" value={formData.senha} onChange={handleInputChange} />
              </div>
              <button type="submit" className="btn btn-primary">Cadastrar</button>
            </form>
          </section>
        )}
        {activeTab === 'login' && (
          <section>
            <h2>Login</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" className="form-control" id="email" name="email" placeholder="Seu e-mail" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input type="password" className="form-control" id="senha" name="senha" placeholder="Sua senha" value={formData.senha} onChange={handleInputChange} />
              </div>
              <button type="submit" className="btn btn-primary">Entrar</button>
            </form>
          </section>
        )}
      </main>
      <footer>
        <p>Copyright © 2023</p>
      </footer>
    </div>
  );
}

export default LoginPage;