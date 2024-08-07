import { useState, useEffect } from "react";
import { loginUser, UserInformations } from "../redux/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
  // states locaux
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState(false);

  // states redux
  const { loading, error, token } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginEvent = (e) => {
    e.preventDefault();
    let userCredentials = {
      email,
      password,
    };
    dispatch(loginUser({ userCredentials, rememberMe: saved })).then(
      (result) => {
        if (loginUser.fulfilled.match(result)) {
          dispatch(UserInformations()).then(() => {
            setEmail("");
            setPassword("");
            navigate("/user");
          });
        }
      }
    );
  };

  const toggleRemenber = () => {
    setSaved(!saved);
  };

  useEffect(() => {
    if (token && !error) {
      dispatch(UserInformations());
      navigate("/user");
    }
    if (token && error) {
      navigate("/");
      localStorage.removeItem("token") || sessionStorage.getItem("token");
    }
  }, [dispatch, token, navigate, error]);

  return (
    <div>
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form onSubmit={handleLoginEvent}>
          <div className="input-wrapper">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div className="input-remember">
            <input
              type="checkbox"
              id="remember-me"
              name="remember-me"
              onChange={toggleRemenber}
              checked={saved}
            />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <button type="submit" className="sign-in-button">
            {loading ? "loading..." : "Sign In"}
          </button>
          {error && (
            <div>
              Error: {typeof error === "string" ? error : error.message}
            </div>
          )}
        </form>
      </section>
    </div>
  );
};
